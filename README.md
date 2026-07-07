<div align="center">

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=900&size=26&pause=10&color=4A90D9&center=true&vCenter=true&width=750&lines=%F0%9F%8E%93+Campus+Placement+Intelligence+System+%F0%9F%9A%80;Smart+Placement+Management+Platform+%F0%9F%92%BC;React+%2B+FastAPI+%2B+PostgreSQL+%E2%9A%A1)](https://git.io/typing-svg)

<img src="assets/Thumbnail.png" width="100%" alt="Campus Placement Intelligence System"/>

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-red?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)

<br/>

> **A full-stack campus recruitment management platform** that connects students, companies, and placement administrators with secure authentication, job management, eligibility checking, application tracking, and placement analytics.

<br/>

**[🚀 Live Demo](https://campus-placements-intelligence-syst.vercel.app/)** · 
**[⚙️ Backend API](https://campus-placements-intelligence-system.onrender.com/)** ·
**[📚 Swagger Docs](https://campus-placements-intelligence-system.onrender.com/docs)**

</div>


---

# 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Authentication](#-authentication)
- [API Modules](#-api-modules)
- [Results Gallery](#-results-gallery)
- [Setup & Usage](#-setup--usage)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)


---

# 🌍 Overview

## 🎓 Campus Placement Intelligence System

Campus Placement Intelligence System is a full-stack web application designed to automate and simplify campus recruitment workflows.

The platform provides separate environments for:

- 🎓 Students to manage profiles, resumes, and applications
- 🏢 Companies to create jobs and manage candidates
- 👨‍💼 Administrators to monitor placement activities

The system replaces traditional manual placement tracking with a centralized digital platform.


---

# ✨ Features

| Feature | Description |
|:---|:---|
| 🔐 Authentication | JWT-based secure login and registration |
| 👨‍🎓 Student Dashboard | Manage profile, skills, academics and applications |
| 🏢 Company Dashboard | Create jobs and manage applicants |
| 👨‍💼 Admin Panel | Manage students, companies and placement records |
| 📄 Resume Upload | Upload and manage student resumes |
| 🎯 Eligibility Checker | Automatically check student-company eligibility |
| 💼 Job Management | Create, update and track placement drives |
| 📝 Application Tracking | Students can apply and monitor status |
| 📊 Placement Analytics | Generate placement insights |
| 🔄 CRUD Operations | Complete backend data management |


---

# 🛠️ Tech Stack

| Category | Technology |
|:---|:---|
| Frontend | React.js + Vite |
| Backend | FastAPI |
| Language | Python |
| Database | PostgreSQL (Neon Cloud) |
| ORM | SQLAlchemy |
| Authentication | JWT + OAuth2 |
| Migration | Alembic |
| Deployment | Vercel + Render |
| Version Control | GitHub |


---

# 🏗️ Architecture


             Users
               |
               |
        React Frontend
          (Vercel)
               |
         REST API Calls
               |
               ▼
      FastAPI Backend
         (Render)
               |
               ▼
    PostgreSQL Database
         (Neon)


---

# 📁 Project Structure



campus-placements-intelligence-system/

│
├── frontend/
│ ├── src/
│ ├── pages/
│ ├── components/
│ └── package.json
│
├── alembic/
│ └── migrations/
│
├── main.py
├── database.py
├── model.py
├── schemes.py
├── requirements.txt
├── alembic.ini
└── README.md



---

# 🗄️ Database Design


Main Entities:

Users
|
├── Students
|
├── Companies
|
├── Jobs
|
└── Applications



Database Features:

- PostgreSQL relational database
- SQLAlchemy ORM models
- Alembic migration management
- Secure user relationships


---

# 🔐 Authentication Flow

User Login
|
▼
FastAPI Authentication API
|
▼
JWT Access Token
|
▼
Role Verification
|
▼
Student / Company / Admin Dashboard



Implemented using:

- JWT Tokens
- Password hashing
- Role-based authorization


---

# 📡 API Modules


| Module | Endpoints |
|:---|:---|
| Authentication | Login, Register, Token Refresh |
| Students | Profile CRUD, Student Management |
| Companies | Company CRUD |
| Jobs | Create & Manage Jobs |
| Applications | Apply Jobs & Status Tracking |
| Resume | Resume Upload |
| Analytics | Placement Analysis |
| Recommendations | Student Recommendations |


Swagger Documentation:

🔗 https://campus-placements-intelligence-system.onrender.com/docs


---
---

## 🖼️ Results Gallery

The application provides dedicated dashboards for students, companies, and administrators.

### 🔐 Authentication

#### Register & Login
<p align="center">
<img src="./results/1%20Register.png" width="700"/>
<img src="./results/2%20Login.png" width="700"/>
</p>

---

## 👨‍🎓 Student Module

### 👩‍🎓 Student Dashboard & Profile Management

<p align="center">
<img src="./results/3%20Student%20Overview.png" width="700"/>
<img src="./results/4%20Student%20My%20Record.png" width="700"/>
</p>

### 🏛️ Job Board & Applications

<p align="center">
<img src="./results/5%20Student%20Job%20Board.png" width="700"/>
<img src="./results/6%20Student%20My%20Applications.png" width="700"/>
</p>

### 🤖 Recommendations & Eligibility

<p align="center">
<img src="./results/7%20Student%20Recommendations.png" width="700"/>
<img src="./results/8%20Student%20Eligibility%20Check.png" width="700"/>
<img src="./results/9%20Student%20Placement%20Analysis.png" width="700"/>
</p>

---

## 🛠️ Admin Module

### 👤 Admin Dashboard & User Management

<p align="center">
<img src="./results/10%20Admin%20Overview.png" width="700"/>
<img src="./results/11%20Studen%20List.png" width="700"/>
<img src="./results/12%20Company%20List.png" width="700"/>
</p>

---

## 🏢 Company Module

###🖱️Company Dashboard & Recruitment Management

<p align="center">
<img src="./results/13%20Company%20Overview.png" width="700"/>
<img src="./results/14%20Company%20Update.png" width="700"/>
<img src="./results/15%20Posting%20Job.png" width="700"/>
</p>

### Application Tracking & Eligible Students

<p align="center">
<img src="./results/16%20Applications.png" width="700"/>
<img src="./results/17%20Eligible%20Students.png" width="700"/>
</p>

---
# ⚙️ Setup & Usage


## Backend Setup


Clone repository:

git clone https://github.com/jk-neha/campus-placements-intelligence-system.git

cd campus-placements-intelligence-system


## Install dependencies

pip install -r requirements.txt

## Create .env

DATABASE_URL=your_neon_database_url
SECRET_KEY=your_secret_key

## Run backend:

uvicorn main:app --reload

## Frontend Setup

## Navigate:

cd frontend

## Install packages:

npm install

## Create .env

VITE_API_URL=http://localhost:8000

## Run:

npm run dev

---

## ☁️ Deployment

GitHub Repository
        |
        |
        ├── Frontend
        |       |
        |       ▼
        |    Vercel
        |
        |
        └── Backend
                |
                ▼
              Render
                |
                ▼
              Neon DB

---

## 🔮 Future Enhancements

🤖 AI-based resume ranking
📧 Email notifications
📅 Interview scheduling system
📊 Advanced placement analytics
📱 Mobile application
🔎 Smart candidate recommendation engine

---

## 👩‍💻 Author

**Neha Vardhini J K** · [@jk-neha](https://github.com/jk-neha)  .[@linkedin](https://www.linkedin.com/in/nehavardhinijk/)

*Personal Project — Campus Placements Intelligence System*

---
*Until then ~~ become better*🌺
---
<div align="center">

⭐ **Star this repo if you found it useful!**

![GitHub stars](https://img.shields.io/github/stars/jk-neha/campus-placements-intelligence-system?style=social)

</div>




