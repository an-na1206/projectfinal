# EduPulse LMS - MERN Stack Course & Learning Management System

[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> A modern, full-stack Course & Learning Management System developed for the **Information & Communication Technology Academy of Kerala (ICTAK)** Full Stack Development Curriculum.

- **GitHub Repository:** [https://github.com/an-na1206/projectfinal.git](https://github.com/an-na1206/projectfinal.git)
- **Author:** Anna Simon
- **Documentation & Report:** [`docs/PROJECT_REPORT.md`](docs/PROJECT_REPORT.md)

---

## 📖 Table of Contents
1. [Overview & Problem Statement](#-overview--problem-statement)
2. [Key Features](#-key-features)
3. [MERN Architecture & Tech Stack](#-mern-architecture--tech-stack)
4. [Project Structure](#-project-structure)
5. [Local Development Quick Start](#-local-development-quick-start)
6. [Environment Variables](#-environment-variables)
7. [Demo Accounts](#-demo-accounts)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [UI Four States Design](#-ui-four-states-design)
10. [Deployment Guide](#-deployment-guide)

---

## 🎯 Overview & Problem Statement

Technical learners frequently struggle with disorganized online tutorials that lack structured lesson progression and verified milestones. Educational academies need a turnkey solution that allows students to enroll in technology curricula, track lecture completions, and monitor real-time skill acquisition.

**EduPulse LMS** resolves this by delivering a streamlined learning portal where students can explore courses, follow step-by-step video modules, and maintain a personalized learning dashboard. Administrators are equipped with full course lifecycle CRUD tools and analytical platform telemetry.

---

## ✨ Key Features

### 🎓 For Students
- **Course Discovery:** Search by keywords, filter by category (`Full Stack MERN`, `Web Development`, `Data Science`, `UI/UX Design`, `Cloud & DevOps`) and skill level (`Beginner`, `Intermediate`, `Advanced`).
- **Interactive Classroom:** Responsive video player with curriculum sidebar, study notes, and one-click lesson completion.
- **Dynamic Progress Calculation:** Automatic real-time recalculation of progress percentages (`completed / total * 100`).
- **Personal Learning Dashboard:** Overview of active, enrolled, and completed courses with completion progress bars.
- **Secure Authentication:** JWT-based session management with encrypted password storage.

### 🛡️ For Administrators / Instructors
- **Course Lifecycle Management:** Create, edit, and delete courses with embedded lessons and syllabi.
- **Platform Telemetry:** Live counters for Total Students, Total Courses, Total Enrollments, and Graduations.
- **User Directory:** View all registered platform participants.

---

## 🏛️ MERN Architecture & Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7 | Responsive client SPA running in the browser |
| **API Server** | Node.js, Express.js | RESTful routing, input validation, and business logic |
| **Database** | MongoDB, Mongoose ODM | Cloud document storage with schemas and indexing |
| **Security** | JWT, BcryptJS | Salted password hashing and Bearer token route authorization |
| **Icons & UI** | Lucide React, Custom CSS | Modern accessible interface with mobile responsiveness |

---

## 📁 Project Structure

```
projectfinal/
├── client/                     # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, CourseCard, ProgressBar, StateViews
│   │   ├── pages/              # Home, Courses, Detail, Dashboard, Classroom, Admin, Auth
│   │   ├── context/            # Global AuthContext & state management
│   │   ├── services/           # Central Axios API client with interceptors
│   │   ├── App.jsx             # Router and layout configuration
│   │   ├── main.jsx            # Application mount
│   │   └── index.css           # Modern design system & responsive styling
│   ├── .env.example            # Client env reference
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express & Node.js Backend API
│   ├── src/
│   │   ├── config/             # MongoDB Mongoose connection
│   │   ├── controllers/        # Auth, Course, Enrollment, Admin controllers
│   │   ├── middleware/         # Auth, Role, and Central Error handling
│   │   ├── models/             # User, Course (embedded lessons), Enrollment schemas
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── seed.js             # Automated database seeder with sample curricula
│   │   └── server.js           # Express app setup and middleware configuration
│   ├── .env.example            # Server env reference
│   └── package.json
├── docs/                       # Project report & documentation
│   └── PROJECT_REPORT.md       # Full submission documentation report
├── .gitignore                  # Git exclusions for node_modules, .env, and dist
└── README.md                   # Primary project readme
```

---

## 🚀 Local Development Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local mongod or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/an-na1206/projectfinal.git
cd projectfinal
```

### Step 2: Configure & Start Backend
```bash
cd server
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret

# Optional: Seed sample courses and users
npm run seed

# Start server in development mode
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Configure & Start Frontend
In a new terminal window:
```bash
cd client
npm install

# Copy environment template
cp .env.example .env

# Run Vite dev server
npm run dev
# React client opens at http://localhost:5173
```

---

## 🔑 Demo Accounts

The project includes pre-configured demo credentials:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@edupulse.com` | `password123` | Full access: stats, course creation & deletion |
| **Student** | `student@edupulse.com` | `password123` | Standard access: enroll, learn, track progress |

*(You can also register a new account on `/register` at any time!)*

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or admin account
- `POST /api/auth/login` - Authenticate & receive Bearer JWT token
- `GET /api/auth/me` - Fetch profile of currently logged-in user

### Courses (`/api/courses`)
- `GET /api/courses` - Paginated course list with search, category & level filters
- `GET /api/courses/:id` - Course details with full syllabus & lessons
- `POST /api/courses` - Create new course *(Admin only)*
- `PUT /api/courses/:id` - Update course metadata *(Admin only)*
- `DELETE /api/courses/:id` - Delete course & cascades enrollments *(Admin only)*

### Enrollments (`/api/enrollments`)
- `POST /api/enrollments/:courseId` - Enroll student in course
- `GET /api/enrollments/my` - Fetch all courses enrolled by logged-in user
- `GET /api/enrollments/check/:courseId` - Check enrollment status for course
- `PUT /api/enrollments/:courseId/progress` - Update completed lesson & recalculate progress %

### Administration (`/api/admin`)
- `GET /api/admin/stats` - Platform telemetry metrics & top enrolled courses *(Admin only)*
- `GET /api/admin/users` - User directory audit *(Admin only)*

---

## 🎨 UI Four States Design

In compliance with ICTAK guidelines, each screen implements four distinct states:
1. **Loading State:** Smooth spinner with descriptive status text.
2. **Success State:** Interactive grids, cards, and classroom players.
3. **Empty State:** Illustrated empty placeholder with prompt and CTA button.
4. **Error State:** Descriptive error notification with an instant retry action.

---

## 🌐 Deployment Guide

### Deploying API on Render
1. Create a **Web Service** pointing to this repository.
2. Set Root Directory: `server`.
3. Set Build Command: `npm install`.
4. Set Start Command: `npm start`.
5. Set Environment Variables in dashboard: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`.

### Deploying Frontend on Vercel
1. Create a **New Project** pointing to this repository.
2. Set Root Directory: `client`.
3. Framework Preset: `Vite`.
4. Set Environment Variable: `VITE_API_URL=https://<your-render-api>.onrender.com/api`.
5. Click **Deploy**.

---

## 📄 License & Credits
Developed by **Anna Simon** for the **Information & Communication Technology Academy of Kerala (ICTAK)** Final Project Submission.
Distributed under the ISC License.
