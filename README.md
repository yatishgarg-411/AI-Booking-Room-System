# 🏨 Hotel Room Booking  System

A modern, full-stack room booking platform for organizations, with **separate Admin and User sides**. Built for real-time management, analytics, and a seamless booking experience.

---

## 👥 Sides of the System

- **Admin Side:**
  - Manage all rooms, view analytics, monitor live room status, and oversee all bookings and activities.
  - Book rooms, extend and release any ongoing booking, cancel upcoming bookings, mark rooms as unavailable, and update room features.
- **User Side:**
  - Book rooms, cancel upcoming bookings, and view personal booking history and live room availability.

---

## ✨ Features

| Feature                        | Description                                                                 |
|--------------------------------|-----------------------------------------------------------------------------|
| 🔐 **JWT Auth**                | Secure login/signup for users and admins using JWT tokens                    |
| 🏢 **Room Management**         | Admins can add, edit, and manage rooms and their features                   |
| 📅 **Room Booking**            | Both users and admins can book available rooms                              |
| ❌ **Cancel Booking**          | Both users and admins can cancel the upcoming bookings                |
| 🔄 **Extend Booking**          | Admins can extend any ongoing booking;  |
| 🚪 **Release Room**            | Admins can release any ongoing booking; users can release their own         |
| 🚫 **Mark Room Unavailable**   | Admins can mark any room as temporarily unavailable                         |
| 📝 **Recent Activity Feed**    | Track all bookings, cancellations, and changes in real time                 |
| 🟢 **Live Room Status**        | See which rooms are available, booked, or unavailable in real time          |
| 📊 **Usage Analytics**         | Admins get dashboards for room usage, booking trends, and utilization rates |
| 🔒 **Protected Routes**        | Only authenticated users can access dashboards and booking features         |
| 🌐 **CORS & API Security**     | Secure cross-origin requests for frontend-backend communication             |
| 🐳 **Dockerized**              | One-command setup for local development and production                      |
| ☁️ **Cloud Deployable**        | Easily deploy backend (Render) and frontend (Vercel)                 |

---

## 🛠️ Tech Stack

- **Backend:** FastAPI (Python), MongoDB (with Motor), JWT for authentication
- **Frontend:** React
- **DevOps:** Docker, Docker Compose, Render, Vercel

---

## 📁 Project Structure

```
Hotel-Room-Booking-System/
  backend/    # FastAPI backend
  frontend/   # React frontend
  docker-compose.yml (optional for local dev)
```

---

## 🚀 Local Development

### 1. Backend (FastAPI)
```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create a .env file with your MongoDB URI:
echo "MONGOURI=your-mongodb-uri" > .env
uvicorn main:app --reload
```

### 2. Frontend (React)
```sh
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## 🐳 Docker (Local)

### Build and Run Both Services
```sh
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ☁️ Deployment

### Backend (Render)
- Deploy `backend/` as a **Web Service** on Render using the Dockerfile.
- Set environment variable: `MONGOURI=your-mongodb-uri`
- Note your backend Render URL (e.g., `https://hotel-booking-room-system.onrender.com`)

### Frontend (Vercel or Render Static Site)
- Deploy `frontend/` as a **Static Site** (recommended) or Docker Web Service.
- Set environment variable: `REACT_APP_API_URL=https://hotel-booking-room-system.onrender.com`
- For Docker, ensure the env var is set at build time.

---

## 📝 Usage Notes
- **IMPORTANT:** Before clicking the deployed frontend link, click the backend Render link to "wake up" the backend (Render free tier sleeps after inactivity).
- Then use the app as normal!

---

## 👨‍💻 Authors
- Yatish Garg
- Akshita
