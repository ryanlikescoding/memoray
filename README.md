<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1s7d_XMQ1UKf9_w_81z1cF7-OwCFo0Yu8

## Running the Backend

This project now uses a Python FastAPI backend for authentication.

### Prerequisites

- Python 3.7+
- `pip install fastapi uvicorn pyjwt pydantic[email]`

### Start the Server

1. Open a terminal in the project root.
2. Run: `python main.py`
3. The backend will start at `http://localhost:8000`.

### Development Note

The current implementation uses an in-memory user database. Restarting the server will clear all registered users. For production, connect to a persistent database (e.g., PostgreSQL, MongoDB).
