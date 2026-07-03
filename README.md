# Employee Leave Management System

## Project Overview

A full-stack **Employee Leave Management System** built to replace manual email/spreadsheet-based leave tracking. Employees can apply for leave and track their history, while managers can review, approve, or reject requests — all from a centralized, role-based web application.

Built with React, Node.js/Express, Prisma ORM, and SQLite as an MVP demonstrating clean architecture, JWT authentication, REST API design, and modern frontend practices.

---

## Features

### Employee
- Secure JWT login/logout with refresh token rotation
- Dashboard with leave stats and remaining balance
- Apply for leave (Casual, Sick, Earned, Maternity, Paternity, Unpaid)
- View, search, and filter leave history by type and status
- Edit or cancel pending leave requests

### Manager
- Dashboard with team-wide leave statistics
- View and search all employees
- Review pending leave requests with full details
- Approve or reject requests with mandatory comments
- Filter all leave records by type/status

### System
- JWT Authentication with Refresh Token rotation (one-time use)
- Role-Based Access Control (EMPLOYEE / MANAGER)
- Leave balance tracking with auto-deduction on approval
- Working day calculation (Mon–Fri, weekends excluded)
- Overlap detection to prevent duplicate leave requests
- Email notifications on apply, approve, and reject
- Audit logs for every action with IP tracking
- Swagger/OpenAPI documentation
- Dark mode toggle (persisted to localStorage)
- Fully responsive design (mobile-friendly)
- API rate limiting (100 req/15 min)
- Helmet security headers, Winston logging
- Docker support, GitHub Actions CI/CD
- Unit & Integration tests

---

## Technology Stack

| Layer      | Technology                                                        |
|------------|-------------------------------------------------------------------|
| Frontend   | React 19, React Router v7, React Hook Form, Axios, React Toastify |
| Backend    | Node.js, Express 5, Prisma ORM                                    |
| Database   | SQLite (via Prisma)                                               |
| Auth       | JWT (Access + Refresh tokens), bcryptjs                           |
| Email      | Nodemailer                                                        |
| Docs       | Swagger UI / OpenAPI 3.0                                          |
| DevOps     | Docker, Docker Compose, GitHub Actions                            |
| Testing    | Jest, Supertest                                                   |
| Logging    | Winston                                                           |

---

## Folder Structure

```
leave-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema & models
│   │   ├── seed.js                # Demo data seeder
│   │   └── migrations/            # Prisma migration history
│   ├── scripts/
│   │   └── export-swagger.js      # Exports openapi.json to docs/
│   └── src/
│       ├── config/                # env.js, logger.js, prisma.js
│       ├── controllers/           # auth, employee, leave controllers
│       ├── middleware/            # authenticate, authorize, errorHandler, rateLimiter
│       ├── repositories/          # DB access layer (leave, employee, audit, token)
│       ├── routes/                # Express routers (auth, employee, leave)
│       ├── services/              # Business logic (auth, leave, employee, email, token)
│       ├── swagger/               # OpenAPI spec definition
│       ├── tests/                 # Unit & integration tests
│       ├── utils/                 # ApiError, ApiResponse, jwt, password, constants
│       ├── validations/           # express-validator rules
│       ├── app.js                 # Express app setup
│       └── server.js              # Server entry point
├── frontend/
│   └── src/
│       ├── components/            # Sidebar, Topbar, Modal, Pagination, Spinner, ProtectedRoute
│       ├── contexts/              # AuthContext (auth state + dark mode)
│       ├── layouts/               # DashboardLayout
│       ├── pages/                 # Login, Dashboard, ApplyLeave, MyLeaves, etc.
│       ├── services/              # API call functions (auth, leave, employee)
│       └── utils/                 # helpers (formatDate, statusClass, etc.)
├── docs/
│   ├── index.html                 # Standalone Swagger UI (open in browser)
│   └── openapi.json               # Static OpenAPI 3.0 spec
├── .github/
│   └── workflows/ci.yml           # GitHub Actions CI/CD pipeline
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Installation Steps

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/moulyaklnsp/leave-management-system.git
cd leave-management-system
```

### 2. Configure environment variables
```bash
# Copy the example env file into backend/
cp .env.example backend/.env
# Edit backend/.env and fill in your JWT secrets
```

### 3. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend (in a new terminal)
cd frontend && npm install
```

---

## Environment Variables

### Backend — `backend/.env`

| Variable              | Description                          | Example                        |
|-----------------------|--------------------------------------|--------------------------------|
| `PORT`                | Backend server port                  | `5000`                         |
| `NODE_ENV`            | Environment                          | `development`                  |
| `DATABASE_URL`        | Prisma SQLite path                   | `file:./database/leave.db`     |
| `JWT_ACCESS_SECRET`   | Secret for access tokens             | `your_long_random_secret`      |
| `JWT_REFRESH_SECRET`  | Secret for refresh tokens            | `your_long_random_secret`      |
| `ACCESS_TOKEN_EXPIRY` | Access token TTL                     | `15m`                          |
| `REFRESH_TOKEN_EXPIRY`| Refresh token TTL                    | `7d`                           |
| `CLIENT_URL`          | Frontend URL for CORS                | `http://localhost:5173`        |
| `SMTP_HOST`           | SMTP server host                     | `smtp.gmail.com`               |
| `SMTP_PORT`           | SMTP server port                     | `587`                          |
| `SMTP_USER`           | SMTP username / email                | `you@gmail.com`                |
| `SMTP_PASS`           | SMTP password / app password         | `your_app_password`            |
| `EMAIL_FROM`          | Sender email address                 | `you@gmail.com`                |

### Frontend — `frontend/.env`

| Variable        | Description          | Example                        |
|-----------------|----------------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL | `http://localhost:5000/api`    |

---

## Database Setup

```bash
cd backend

# Run migrations to create all tables
npx prisma migrate dev --name init

# Seed the database with demo users and sample leaves
node prisma/seed.js
```

This creates:
- 4 departments (Engineering, HR, Finance, Marketing)
- 1 Manager account
- 2 Employee accounts
- Sample leave records across all statuses (PENDING, APPROVED, REJECTED)

To view the database visually:
```bash
npx prisma studio
```

---

## Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed demo data
node prisma/seed.js

# Start development server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Running the Application

### Option 1 — Manual (Development)

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Option 2 — Docker (Production-like)

```bash
# From the root directory
cp .env.example .env        # fill in JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
docker-compose up --build
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:5173            |
| Backend  | http://localhost:5000            |
| API Docs | http://localhost:5000/api-docs   |

### Running Tests

```bash
cd backend

# Unit tests only
npm test

# Integration tests only
npm run test:integration

# All tests
npm run test:all
```

### Regenerate API Docs

```bash
cd backend
node scripts/export-swagger.js   # updates docs/openapi.json
```

---

## API Documentation

**Live Swagger UI:** http://localhost:5000/api-docs

**Static docs (no server needed):** open `docs/index.html` in your browser

**Import into Postman/Insomnia:** use `docs/openapi.json`

### Endpoints Summary

| Method   | Endpoint                          | Role     | Description                    |
|----------|-----------------------------------|----------|--------------------------------|
| POST     | /api/auth/login                   | Public   | Login with email & password    |
| POST     | /api/auth/logout                  | Auth     | Logout and revoke token        |
| POST     | /api/auth/refresh                 | Public   | Refresh access token           |
| GET      | /api/employees/profile            | Auth     | Get own profile                |
| GET      | /api/employees                    | Manager  | List all employees             |
| GET      | /api/employees/:id                | Manager  | Get employee by ID             |
| POST     | /api/leaves                       | Employee | Apply for leave                |
| GET      | /api/leaves                       | Auth     | Get leaves (own / all)         |
| GET      | /api/leaves/pending               | Manager  | Get all pending leaves         |
| GET      | /api/leaves/dashboard/employee    | Employee | Employee dashboard stats       |
| GET      | /api/leaves/dashboard/manager     | Manager  | Manager dashboard stats        |
| GET      | /api/leaves/:id                   | Auth     | Get leave by ID                |
| PUT      | /api/leaves/:id                   | Employee | Update pending leave           |
| DELETE   | /api/leaves/:id                   | Employee | Cancel pending leave           |
| PUT      | /api/leaves/:id/approve           | Manager  | Approve leave                  |
| PUT      | /api/leaves/:id/reject            | Manager  | Reject leave with comments     |

---

## Sample Login Credentials

> Run `node prisma/seed.js` from the `backend/` folder to create these accounts.

| Role     | Email                | Password       |
|----------|----------------------|----------------|
| Manager  | manager@company.com  | Manager@123    |
| Employee | john@company.com     | Employee@123   |
| Employee | jane@company.com     | Employee@123   |

---

## Database Schema

### Employee
`id` · `employeeCode` · `firstName` · `lastName` · `email` · `password` · `departmentId` · `role` (EMPLOYEE/MANAGER) · `isActive` · `isDeleted` · `createdAt` · `updatedAt`

### Department
`id` · `name` · `createdAt`

### Leave
`id` · `employeeId` · `approvedById` · `leaveType` · `startDate` · `endDate` · `totalDays` · `reason` · `status` · `managerComments` · `approvedAt` · `appliedAt` · `updatedAt`

### LeaveBalance
`id` · `employeeId` · `casual` · `sick` · `earned` · `maternity` · `paternity` · `unpaid` · `updatedAt`

### RefreshToken
`id` · `token` · `employeeId` · `expiresAt` · `createdAt`

### AuditLog
`id` · `employeeId` · `action` · `entity` · `entityId` · `description` · `ipAddress` · `createdAt`

### EmailLog
`id` · `recipient` · `subject` · `status` · `sentAt`

---

## Assumptions

- SQLite is used for simplicity; swap to PostgreSQL by changing `provider` in `schema.prisma`
- Leave balance is checked on application and deducted only on approval
- Working days are Mon–Fri; weekends are excluded from the day count
- Managers cannot apply for leave (role-based restriction enforced on both frontend and backend)
- Refresh tokens are single-use and rotated on every refresh call
- Email notifications are sent asynchronously and do not block the API response; if SMTP is not configured, emails are silently skipped and logged

---

## Known Limitations

- No file/document attachment support for leave applications
- Single global manager role — no department-level manager scoping
- No leave carry-forward or encashment logic
- SQLite does not support concurrent writes well — use PostgreSQL for production

---

## Future Enhancements

- Department-level manager assignment and scoping
- Leave carry-forward and encashment at year-end
- Calendar view for visualizing team leave schedules
- Push notifications (in-app + browser)
- PostgreSQL migration for production scalability
- Mobile app (React Native)
- Leave approval workflow with multi-level approvals
- HR admin role for managing employees and departments
