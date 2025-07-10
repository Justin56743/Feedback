# Gramtek Portal: Employee Complaint & Feedback System

## Overview

Gramtek Portal is a full-stack web application for managing employee complaints and feedback. It features user authentication, role-based dashboards (employee/admin), and a feedback management system. Employees can submit and track feedback, while admins can manage and resolve complaints.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Radix UI
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** (Configured via Prisma, e.g., SQLite/PostgreSQL/MySQL)
- **Authentication:** JWT (JSON Web Tokens)

## Features

- User registration and login (JWT-based authentication)
- Role-based dashboards: Employee and Admin
- Employees can submit, edit, and delete their feedback/complaints
- Admins can view, update status, and add remarks to all feedback
- Feedback status tracking (open, in-progress, resolved, rejected)

## Project Structure

```
frontend/   # Next.js React frontend
backend/    # Express.js backend API
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### 1. Clone the repository
```bash
git clone <repo-url>
cd <repo-root>
```

### 2. Install dependencies
#### Frontend
```bash
cd frontend
npm install
```
#### Backend
```bash
cd ../backend
npm install
```

### 3. Configure Environment
- Set up your database and Prisma schema in `backend/prisma/`.
- Set the JWT secret in `backend/app.js` (replace `'your_jwt_secret'`).

### 4. Run the app
#### Backend
```bash
cd backend
node app.js
# or
npm start
```
Backend runs on [http://localhost:5000](http://localhost:5000)

#### Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on [http://localhost:3000](http://localhost:3000)

## API Endpoints (Backend)

### Auth
- `POST /api/register` — Register a new user `{ username, password, role }`
- `POST /api/login` — Login and receive JWT `{ username, password }`

### Feedback (JWT required)
- `POST /api/feedback/` — Submit feedback `{ category, description }`
- `GET /api/feedback/` — List feedback (admin: all, user: own)
- `GET /api/feedback/:id` — Get feedback by ID
- `PATCH /api/feedback/:id` — Update feedback (admin: status/remarks, user: own open feedback)
- `DELETE /api/feedback/:id` — Delete own open feedback

## Usage

- Register as a new user (employee or admin)
- Login to access your dashboard
- Employees: Submit and track feedback
- Admins: Manage and resolve feedback

## License

ISC 
