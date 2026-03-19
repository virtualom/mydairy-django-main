# MyDiary — Personal Journal App

A full-stack personal diary web application built with **Django REST Framework** (backend) and **React + Vite** (frontend).

## Features

- ✍️ **CRUD Diary Entries** — Create, read, update, and delete entries
- 🎭 **Mood Tracking** — Select from 6 moods (happy, sad, angry, anxious, calm, excited)
- 🏷️ **Tags** — Organize entries with custom tags
- 🔍 **Search & Filter** — Search by keyword, filter by mood, tag, or date range
- 📅 **Calendar View** — See which days have entries at a glance
- 🔥 **Streak Tracker** — Track consecutive writing days
- 🔐 **JWT Authentication** — Secure login/register, each user sees only their entries
- 🌙 **Dark Mode** — Warm, aesthetic dark theme with amber/cream accents

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Backend  | Django 4.2, Django REST Framework, SimpleJWT       |
| Database | SQLite                                            |
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router 6 |
| Editor   | React Quill (rich text)                           |
| HTTP     | Axios with JWT interceptors                       |

## Project Structure

```
mydairy-django-main/
├── backend/
│   ├── diary_project/        # Django project settings
│   ├── entries/              # Entries app (models, views, serializers)
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context
│   │   └── pages/            # Page components
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations entries
python manage.py migrate

# Create superuser (optional, for admin)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| POST   | `/api/auth/register/`     | Register new user     |
| POST   | `/api/auth/token/`        | Login (get JWT)       |
| POST   | `/api/auth/token/refresh/`| Refresh JWT token     |
| GET    | `/api/entries/`           | List entries          |
| POST   | `/api/entries/`           | Create entry          |
| GET    | `/api/entries/{id}/`      | Get entry             |
| PUT    | `/api/entries/{id}/`      | Update entry          |
| DELETE | `/api/entries/{id}/`      | Delete entry          |
| GET    | `/api/entries/calendar/`  | Dates with entries    |
| GET    | `/api/entries/streak/`    | Writing streak        |
| GET    | `/api/tags/`              | List tags             |

### Filtering & Search

```
GET /api/entries/?search=keyword
GET /api/entries/?mood=happy
GET /api/entries/?tag=personal
GET /api/entries/?date_from=2024-01-01&date_to=2024-12-31
```
