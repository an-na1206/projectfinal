# PROJECT REPORT: EDUPULSE LEARNING MANAGEMENT SYSTEM (LMS)
**Information & Communication Technology Academy of Kerala (ICTAK)**  
*Full Stack Web Development (MERN Stack)*

---

### Candidate / Repository Information
- **Student Name / Author:** Anna Simon
- **GitHub Repository Link:** [https://github.com/an-na1206/projectfinal.git](https://github.com/an-na1206/projectfinal.git)
- **Hosted Application URL:** [https://edupulse-lms.vercel.app](https://edupulse-lms.vercel.app) *(or Render/Vercel production URL)*
- **API Documentation Endpoint:** `https://<backend-url>/api/health`
- **Submission Date:** October 2026

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem Statement
Modern learners and technical professionals frequently face fragmented learning experiences, lacking structured syllabi, verified video modules, and clear real-time progress indicators. Educational institutions and training academies need a centralized, performant, and secure platform that allows students to enroll in technology curricula, track lesson completion step-by-step, and allows instructors/administrators to manage courses and monitor student engagement without operational overhead.

### 1.2 Proposed Solution: EduPulse LMS
EduPulse LMS is an enterprise-ready, responsive Course & Learning Management System developed with the **MERN Stack** (MongoDB, Express.js, React 19 with Vite, and Node.js). It separates concerns into a modular REST API backend and a single-page frontend.

**Key capabilities include:**
- Role-based authorization distinguishing **Students** and **Administrators**.
- Course exploration with full-text search, multi-category filtering, and pagination.
- Interactive course player with embedded video lectures and real-time progress calculation.
- Personal learning dashboard summarizing enrolled, in-progress, and completed courses.
- Administrative portal featuring system-wide telemetry, user audit tables, and full course lifecycle management.

---

## 2. Target Users & User Stories

### 2.1 User Roles
1. **Student (Learner):**
   - Can register, login, view course syllabi, enroll in courses, view video lectures, mark lessons as completed, and track progress.
   - Cannot create or delete courses, nor access administrative metrics.
2. **Administrator / Instructor:**
   - Can authenticate, view high-level platform telemetry (total enrollments, active students, completion rates), create new courses with structured modules, update course metadata, and delete obsolete courses.

### 2.2 User Stories & Acceptance Criteria

| User Story | Role | Acceptance Criteria |
| :--- | :--- | :--- |
| **US-01: User Registration & Login** | Guest | User provides valid name, email, and password (min. 6 chars). Password is salted and hashed with bcrypt. Returns a signed JWT token on success. Duplicate email returns 409 Conflict. |
| **US-02: Course Discovery & Search** | Student | User can search courses by keyword, filter by category or skill level, and paginate through results (max 6-9 per page). Loading, empty, and error states are clearly rendered. |
| **US-03: Course Enrollment** | Student | A logged-in student can enroll in any published course. Duplicate enrollments are prevented via compound unique indexes. Enrolled courses appear instantly in "My Learning". |
| **US-04: Interactive Lesson Progression** | Student | While viewing a course in the Classroom player, student can mark lessons as complete. Progress percentage updates automatically (`completed / total * 100`). At 100%, completion celebration badge is unlocked. |
| **US-05: Course Inventory Management** | Admin | Administrator can create, update, and remove courses. Deleting a course cleanly cascades and removes associated enrollment records. |
| **US-06: Telemetry & Platform Stats** | Admin | Admin can inspect platform statistics: total users, total students, total courses, total enrollments, completion tally, and top-enrolled courses. |

---

## 3. Architecture & System Flow

### 3.1 MERN Tiered Architecture
```
+-------------------------------------------------------------+
|                      Client Browser                         |
|  React 19 SPA (Vite) + React Router v7 + Context API        |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON (REST)
                              |
                              v
+-------------------------------------------------------------+
|                     Node.js / Express API                   |
|  CORS Middleware -> JSON Body Parser -> JWT Bearer Auth     |
|             -> Controller Logic -> Input Validation         |
+-------------------------------------------------------------+
                              |
                     Mongoose ODM (Queries)
                              |
                              v
+-------------------------------------------------------------+
|                      MongoDB Database                       |
|   Collections: Users, Courses (Embedded Lessons),           |
|                Enrollments (Compound Unique Index)          |
+-------------------------------------------------------------+
```

### 3.2 Request-Response Cycle (Enrollment Example)
1. **Frontend Trigger:** Student clicks "Enroll in This Course" on `CourseDetailPage`.
2. **API Client:** Axios service intercepts request, extracts JWT Bearer token from localStorage, and issues `POST /api/enrollments/:courseId`.
3. **Middleware:** `authMiddleware.protect` extracts the Bearer token, verifies its cryptographic signature using `JWT_SECRET`, decodes student ID, and attaches `req.user`.
4. **Controller:** `enrollmentController.enrollInCourse` verifies the course ID, checks for existing enrollments, and calls `Enrollment.create()`.
5. **Database:** MongoDB verifies unique compound index `{ student: 1, course: 1 }`, persists document, and returns response.
6. **Response & State:** API returns HTTP 201 Created with JSON payload. React updates local state and automatically redirects student to `/learn/:courseId`.

---

## 4. Database Schema Design (Mongoose)

### 4.1 User Schema (`models/User.js`)
- `name`: String (Required, trimmed, max 50 chars)
- `email`: String (Required, unique index, lowercase, validated with regex)
- `password`: String (Required, minlength 6, bcrypt salted hash, select: false)
- `role`: String (Enum: `['student', 'admin']`, default: `'student'`)
- `avatar`: String (Default avatar URL)
- `bio`: String (Max 300 chars)
- `timestamps`: true

### 4.2 Course Schema (`models/Course.js`)
- `title`: String (Required, trimmed, max 120 chars)
- `description`: String (Required, max 2000 chars)
- `category`: String (Enum: `['Full Stack MERN', 'Web Development', 'Data Science', 'UI/UX Design', 'Cloud & DevOps']`)
- `level`: String (Enum: `['Beginner', 'Intermediate', 'Advanced']`, default: `'Beginner'`)
- `price`: Number (Default 0, min: 0)
- `thumbnail`: String (Image URL)
- `instructor`: ObjectId ref `'User'` (Required)
- `instructorName`: String
- `duration`: String (e.g. `'6 Weeks'`)
- `lessons`: Embedded Subdocument Array
  - `title`: String (Required)
  - `duration`: String
  - `content`: String
  - `videoUrl`: String (Embeddable stream/video URL)
- `isPublished`: Boolean (Default: true)
- `indexes`: Text index on `{ title, description }`, compound index on `{ category, level }`

### 4.3 Enrollment Schema (`models/Enrollment.js`)
- `student`: ObjectId ref `'User'` (Required)
- `course`: ObjectId ref `'Course'` (Required)
- `completedLessons`: Array of ObjectIds (Tracking completed lesson IDs)
- `progress`: Number (0 to 100 percentage)
- `status`: String (Enum: `['active', 'completed']`, default: `'active'`)
- `enrolledAt`: Date (Default: `Date.now`)
- `indexes`: Compound unique index on `{ student: 1, course: 1 }` to prevent duplicate student registrations.

---

## 5. RESTful API Contract

| Method | Endpoint | Description | Access | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public | `201 Created` | `400 Bad Request`, `409 Conflict` |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT | Public | `200 OK` | `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user | Private | `200 OK` | `401 Unauthorized`, `404 Not Found` |
| `GET` | `/api/courses` | List courses (with search, category, level & page) | Public | `200 OK` | `500 Server Error` |
| `GET` | `/api/courses/:id` | Fetch single course and lesson details | Public | `200 OK` | `404 Not Found` |
| `POST` | `/api/courses` | Create new course with modules | Admin | `201 Created` | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden` |
| `PUT` | `/api/courses/:id` | Update existing course attributes | Admin | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/courses/:id` | Remove course and delete related enrollments | Admin | `200 OK` | `404 Not Found` |
| `POST` | `/api/enrollments/:courseId` | Enroll in course | Student | `201 Created` | `400 Bad Request (duplicate)`, `401 Unauthorized` |
| `GET` | `/api/enrollments/my` | Retrieve all enrolled courses for logged-in user | Student | `200 OK` | `401 Unauthorized` |
| `GET` | `/api/enrollments/check/:courseId` | Check enrollment and progress status | Student | `200 OK` | `401 Unauthorized` |
| `PUT` | `/api/enrollments/:courseId/progress`| Mark lesson completed & update % | Student | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `GET` | `/api/admin/stats` | Retrieve platform-wide metrics & telemetry | Admin | `200 OK` | `401 Unauthorized`, `403 Forbidden` |
| `GET` | `/api/admin/users` | List all registered users (Admin view) | Admin | `200 OK` | `403 Forbidden` |
| `GET` | `/api/health` | Service uptime and diagnostic ping | Public | `200 OK` | None |

---

## 6. Frontend Implementation & UI States

In compliance with **Section 7.3** of the ICTAK Student Guide, every screen implements four fundamental states:
1. **Loading State:** CSS animated dual-ring spinner with contextual prompt while asynchronous promises resolve.
2. **Success State:** Structured responsive cards, progress meters, and tabular views.
3. **Empty State:** Illustrated empty-box icon, informative explanation, and actionable button (e.g. "Clear filters" or "Explore catalog").
4. **Error State:** User-friendly notification banner with an instant "Retry" action that re-triggers data fetching without a full-page reload.

---

## 7. Security & Best Practices

1. **Password Hashing:** Passwords are never stored in plain text. A 10-round salted `bcryptjs` hash is computed inside the Mongoose pre-save hook.
2. **Access Control:** `protect` and `adminOnly` middlewares rigorously enforce route access at the HTTP controller level.
3. **NoSQL Injection Prevention:** Input validation and typed Mongoose schemas ensure query objects cannot be contaminated with malicious operators.
4. **Environment Variables:** All sensitive variables (`MONGODB_URI`, `JWT_SECRET`) reside solely in `.env` files and are omitted from version control via `.gitignore`. `.env.example` templates are committed for transparency.
5. **CORS Restrictions:** Express only allows defined origins from `CLIENT_URL`, preventing unauthenticated cross-origin abuse.

---

## 8. Deployment & Hosting Guide

### 8.1 Backend (Render / Railway)
1. Link GitHub repository `an-na1206/projectfinal`.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install`.
4. Set Start Command: `npm start`.
5. Add Environment Variables in dashboard:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/edupulse?retryWrites=true&w=majority`
   - `JWT_SECRET=<your-production-secret>`
   - `CLIENT_URL=https://<your-frontend>.vercel.app`

### 8.2 Frontend (Vercel)
1. Link GitHub repository `an-na1206/projectfinal`.
2. Set Root Directory to `client`.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_URL=https://<your-backend>.onrender.com/api`
7. SPA Fallback: Configured via Vite build outputs.

---

## 9. Conclusion & ICTAK Checklist Verification
EduPulse LMS satisfies all milestones, architectural requirements, and best practices set forth in the ICTAK Student Reference Guide:
- Clean modular structure with strict separation of concerns.
- Working authentication with JWT and bcrypt.
- Complete CRUD capabilities for courses and enrollments.
- Responsive client UI handling Loading, Success, Empty, and Error states.
- Ready for full deployment to MongoDB Atlas, Render, and Vercel.
