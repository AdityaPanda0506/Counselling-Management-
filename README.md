<div align="center">

# 🧠 Pulse Tracker — Happiness Index & Counselling Management System

**A privacy-first, full-stack student well-being platform built for hostel environments.**

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Built for **Solveathon26 — Theme 5: Student Well-Being & Counselling** (PS-010)

</div>

---

## 📖 Overview

Hostel students frequently experience academic pressure, personal challenges, and adjustment issues that affect their mental health. **Pulse Tracker** addresses this by providing a structured, privacy-preserving system to:

- 📊 **Track** student mood and stress levels over time
- 📅 **Schedule** counselling sessions with ease
- 🚨 **Alert** wardens and counsellors about high-stress blocks
- 🔒 **Protect** student identity using SHA-256 anonymisation
- 🤖 **Integrate** future ML models for predictive mental health alerts

---

## ✨ Features

### 👨‍🎓 Student Portal
- Log daily **Mood** and **Stress/Pulse Rate** via intuitive sliders
- View **7-day rolling averages** of mood and stress — computed automatically
- **Auto-SOS trigger** if averages fall into the alarming range (mood ≤ 2.5 or stress ≥ 4)
- Book a **counselling session** on a chosen date

### 🏠 Warden Portal
- Block-level **bar chart** showing aggregated stress & mood across all blocks
- **Red alert banner** for blocks with dangerously high-stress averages
- Expandable block cards revealing **individual anonymous student records** (SHA-256 privacy preserved)
- Students sorted by stress level for instant prioritisation

### 💼 Counsellor Portal
- Combined view of **SOS requests** (highlighted in red) and **regular appointments**
- **ML Predictive Insights panel** — a ready-to-integrate placeholder for your ML model API
- Each prediction shows:  anonymised hash, risk level (`High` / `Medium`), and pattern reasoning

---

## 🔒 Privacy Architecture

> _"The solution should be privacy-focused and should not require complex infrastructure while ensuring confidentiality of student data."_ — PS-010

All student identities are anonymised before being stored:

```
Student Roll No  →  SHA-256 Hash  →  Stored in MongoDB
e.g., "2023CS01" → "e3b0c...b855" → Only hash is persisted
```

- **Students** see only their own data
- **Wardens** see block-level aggregates + anonymised per-student entries
- **No individual student identity** is ever exposed to the warden or counsellor view via MongoDB

---

## 🛠️ Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React.js, React Router v6, Recharts     |
| Backend     | Python Flask, Flask-CORS                |
| Database    | MongoDB Atlas (via PyMongo)             |
| Styling     | Vanilla CSS (Dark theme + Glassmorphism)|
| Charts      | Recharts                                |
| Icons       | Lucide React                            |
| HTTP Client | Axios                                   |
| Privacy     | SHA-256 (hashlib)                       |

---

## 📁 Project Structure

```
Counselling-Management-/
│
├── backend/
│   ├── app.py              # Flask API (all routes)
│   ├── requirements.txt    # Python dependencies
│   └── .env                # MongoDB connection string
│
├── src/
│   ├── components/
│   │   ├── Landing.js          # Role selection home page
│   │   ├── Login.js            # Role-specific login 
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── StudentDashboard.js # Student pulse log + booking
│   │   ├── WardenDashboard.js  # Block analytics + individual view
│   │   └── CounsellorDashboard.js # Appointments + ML panel
│   ├── App.js              # Router & layout
│   └── index.css           # Global design system (CSS variables, glassmorphism)
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [Python](https://www.python.org/) 3.8+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/counselling-management.git
cd counselling-management
```

### 2. Configure Environment

Create (or update) `backend/.env`:

```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Database"
PORT=5000
```

### 3. Install & Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

> Flask API will start at **http://localhost:5000**

### 4. Install & Start the Frontend

Open a **new terminal** in the project root:

```bash
npm install
npm start
```

> React app will open at **http://localhost:3000**

---

## 🌐 API Reference

### Pulse

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pulse` | Save a student's mood & stress entry |
| `GET`  | `/api/pulse/average/<student_id>` | Get 7-day rolling average for a student |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/blocks` | Aggregated stats per hostel block |
| `GET` | `/api/analytics/students/<block>` | Per-student (anonymised) averages for a block |

### Counselling

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/counselling/book` | Book a session (or trigger SOS) |
| `GET`  | `/api/counselling/appointments` | List all appointments |

### ML (Placeholder)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ml/predict` | Returns predictive risk flags (plug in your ML model here) |

---

## 🔌 Integrating Your ML Model

The `/api/ml/predict` endpoint is a ready-to-fill placeholder. Replace the dummy response in `backend/app.py` with your actual ML logic:

```python
@app.route('/api/ml/predict', methods=['GET'])
def predict_stress():
    # TODO: Replace with your trained model inference
    predictions = your_ml_model.predict(db.pulses)
    return jsonify(predictions), 200
```

The frontend **CounsellorDashboard** will automatically display whatever your model returns, as long as each record has:
- `student_hash` — anonymised student ID
- `risk_level` — `"High"` or `"Medium"`
- `reason` — short human-readable explanation string

---

## 🎨 Design System

The UI uses a consistent design system defined in `src/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#3b82f6` | Buttons, charts, highlights |
| `--accent` | `#8b5cf6` | Mood scores, counsellor accents |
| `--danger` | `#ef4444` | Stress alerts, SOS, high-risk |
| `--success` | `#10b981` | Confirmations, normal status |
| `--bg-dark` | `#0f172a` | Sidebar, panels |
| `--bg-darker` | `#020617` | App background |

---

## 🧪 Demo Flow

1. Open **http://localhost:3000**
2. Click **Student Portal** → Enter Roll No → Select Block → **Log In**
3. Use the sliders on the dashboard to log your Mood & Stress → Click **Save Entry**
4. Averages update live on screen and persist to MongoDB
5. Log **very low mood + high stress** → SOS banner appears
6. Go back to `/` → **Warden Portal** → See block chart → Click a block to expand individual rows
7. Go back to `/` → **Counsellor Portal** → See appointments and ML insights

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ for Solveathon26 — PS-010: Happiness Index, Stress Analytics & Counselling Management System
</div>
