from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uvicorn
import jwt
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import json
import os

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email Configuration (using environment variables in production is recommended)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "your-email@gmail.com"
SMTP_PASSWORD = "your-app-password" # Use App Password for Gmail
FROM_EMAIL = "your-email@gmail.com"
FRONTEND_URL = "http://localhost:8080" # Change this to your frontend URL

# Secret key for JWT
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"

# In-memory user store (replace with a database in production)
users_db = {}
# Reset tokens store: {token: {"email": email, "exp": expiration_time}}
reset_tokens = {}

BASE_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: str

class UserLogin(UserBase):
    password: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def send_reset_email(email: str, token: str):
    reset_link = f"{FRONTEND_URL}/pages/reset-password.html?token={token}"
    
    msg = MIMEMultipart()
    msg['From'] = FROM_EMAIL
    msg['To'] = email
    msg['Subject'] = "Reset Your Memoray Password"
    
    body = f"""
    Hi,
    
    You requested to reset your password for Memoray.
    Please click the link below to set a new password:
    
    {reset_link}
    
    If you did not request this, please ignore this email.
    The link will expire in 1 hour.
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Error sending email: {e}")
        pass

@app.post("/api/register", response_model=Token)
async def register(user: UserCreate):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users_db[user.email] = {
        "email": user.email,
        "password": user.password,
        "name": user.name
    }
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_name": user.name,
        "user_email": user.email
    }

@app.post("/api/login", response_model=Token)
async def login(user: UserLogin):
    db_user = users_db.get(user.email)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_name": db_user["name"],
        "user_email": db_user["email"]
    }

@app.post("/api/forgot-password")
async def forgot_password(request: ForgotPassword):
    if request.email not in users_db:
        return {"message": "If this email is registered, a reset link has been sent."}
    
    token = secrets.token_urlsafe(32)
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    reset_tokens[token] = {"email": request.email, "exp": expiration}
    
    send_reset_email(request.email, token)
    
    return {"message": "If this email is registered, a reset link has been sent."}

@app.post("/api/reset-password")
async def reset_password(request: ResetPassword):
    token_data = reset_tokens.get(request.token)
    
    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    if datetime.datetime.utcnow() > token_data["exp"]:
        del reset_tokens[request.token]
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    email = token_data["email"]
    if email in users_db:
        users_db[email]["password"] = request.new_password
        
    del reset_tokens[request.token]
    
    return {"message": "Password successfully reset"}

@app.get("/api/verify-token")
async def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = users_db.get(email)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
            
        return {"status": "ok", "user_name": user["name"], "user_email": user["email"]}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/timetable")
async def get_timetable():
    file_path = os.path.join(BASE_DATA_DIR, "ryanshi", "timetable", "timetable.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Timetable data not found at {file_path}")
    with open(file_path, "r") as f:
        data = json.load(f)
    return data

@app.get("/api/performance")
async def get_performance():
    base_path = os.path.join(BASE_DATA_DIR, "ryanshi")
    subjects = []
    
    if not os.path.exists(base_path):
        raise HTTPException(status_code=404, detail=f"Data directory not found at {base_path}")
        
    for item in os.listdir(base_path):
        item_path = os.path.join(base_path, item)
        if os.path.isdir(item_path) and item != "timetable":
            perf_file = os.path.join(item_path, "performance.json")
            if os.path.exists(perf_file):
                with open(perf_file, "r") as f:
                    subject_data = json.load(f)
                    subjects.append(subject_data)
                    
    return {"subjects": subjects}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
