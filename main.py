from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn
import jwt
import datetime

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for JWT
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"

# In-memory user store (replace with a database in production)
users_db = {}

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: str

class UserLogin(UserBase):
    password: str

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

@app.post("/api/register", response_model=Token)
async def register(user: UserCreate):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Store user (in production, hash the password!)
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
