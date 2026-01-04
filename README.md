<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Memoray - Your AI-Powered Study Partner

Memoray is a modern, Multi-Page Application (MPA) designed to help students organize their studies using AI. Effortlessly create smart timetables, track your academic progress, and generate personalized revision lists.

## 🚀 Key Features

- **Smart Timetables**: AI-generated study schedules tailored to your courses and commitments.
- **Performance Tracking**: Monitor your scores and visualize your academic growth over time.
- **AI-Powered Revision**: Get personalized topic recommendations based on your performance.
- **Secure Authentication**: Server-side login and registration system using FastAPI and JWT.
- **Responsive Design**: Modern UI built with Tailwind CSS, supporting both light and dark modes.

## 🛠️ Technology Stack

### Frontend
- **Vanilla JavaScript & React**: Built using a "vanilla" approach with React via CDN for zero-build-step development.
- **Babel Standalone**: In-browser JSX compilation.
- **Tailwind CSS**: Utility-first styling via the Play CDN.
- **Lucide Icons**: Beautiful, consistent iconography with a custom React wrapper.

### Backend
- **Python FastAPI**: High-performance asynchronous API framework.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Pydantic**: Robust data validation and settings management.

## 🚦 Getting Started

### 1. Prerequisites
Ensure you have **Python 3.7+** installed on your machine.

### 2. Install Backend Dependencies
Open your terminal in the project root and run:
```bash
pip install fastapi uvicorn pyjwt pydantic[email]
```

### 3. Run the Backend Server
Start the FastAPI server:
```bash
python main.py
```
The backend will be available at `http://localhost:8000`.

### 4. Launch the Frontend
Since this is a vanilla HTML/JS project, you can simply open `index.html` in your browser. For the best experience (including proper routing and icon loading), it is recommended to use a simple local server:
- **VS Code**: Use the "Live Server" extension.
- **Python**: Run `python -m http.server 8080` and visit `http://localhost:8080`.

## 📁 Project Structure

- `index.html`: Landing page and entry point.
- `login.html` / `register.html`: Authentication pages.
- `dashboard.html`: Main user overview.
- `timetable.html`: AI Timetable generator.
- `performance.html`: Progress tracking and revision list.
- `settings.html`: User profile and account management.
- `js/components/`: Reusable UI components (Layout, Sidebar, TopNav).
- `js/screens/`: Page-specific React components.
- `js/services/`: API services and utility wrappers (Gemini, Lucide).
- `main.py`: FastAPI backend implementation.

## 📝 Development Note

The current backend implementation uses an **in-memory user database**. This means all registered users will be cleared when the server restarts. For a production environment, it is recommended to connect a persistent database such as PostgreSQL or MongoDB.
