# Employee Leave Management System

## Project Overview

The Employee Leave Management System is a full-stack web application developed to digitize and simplify the leave management process within an organization.

The system replaces manual leave tracking through emails and spreadsheets by providing a centralized platform where employees can submit leave requests, monitor their leave history, and track approval status. Managers can efficiently review, approve, or reject leave requests while maintaining complete visibility into employee leave records.

The application follows a layered architecture with secure JWT authentication, role-based authorization, RESTful APIs, responsive frontend design, and a normalized relational database using Prisma ORM.

---

## Features

### Authentication
- Secure Login & Logout
- JWT Access Token Authentication
- JWT Refresh Token Rotation
- Role-Based Access Control (Employee & Manager)
- Protected Routes
- Password Encryption using bcrypt
- Input Validation
- API Rate Limiting

### Employee Features
- Employee Dashboard
- Apply Leave
- Edit Pending Leave
- Cancel Pending Leave
- View Leave History
- Search Leave History
- Filter Leave Records
- View Leave Balance
- Dark Mode

### Manager Features
- Manager Dashboard
- View All Employees
- Search Employees
- View Pending Leave Requests
- Approve Leave Requests
- Reject Leave Requests with Comments
- View Employee Leave History
- Filter Leave Requests

### System Features
- Leave Balance Calculation
- Working Day Calculation
- Overlapping Leave Detection
- Email Notifications
- Audit Logs
- Swagger API Documentation
- Responsive Design
- Docker Support
- GitHub Actions CI/CD
- Unit Testing
- Integration Testing

## Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React, Vite, React Router, Axios, React Hook Form |
| Backend | Node.js, Express.js |
| Database | SQLite + Prisma ORM |
| Authentication | JWT, Refresh Tokens, bcrypt |
| Validation | express-validator |
| Documentation | Swagger (OpenAPI) |
| Email | Nodemailer |
| Logging | Winston |
| Security | Helmet, CORS, Rate Limiting |
| Testing | Jest, Supertest |
| DevOps | Docker, Docker Compose, GitHub Actions |

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
postman/
│   ├── LMS.postman_collection.json    # Postman collection containing all API endpoints
│   └── LMS.postman_environment.json   # Postman environment variables (base URL, tokens, etc.)
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
The project uses Prisma ORM with SQLite.

Database setup includes:

- Prisma schema
- Database migrations
- Seed data
- Prisma Studio for database visualization

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
cp .env.example .env       
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
- Authentication is performed using JWT Access and Refresh Tokens.
- Managers are responsible for reviewing employee leave requests.
- Employees can modify only pending leave requests.
- Leave balances are updated only after approval.

---

## Known Limitations

- No file/document attachment support for leave applications
- Single global manager role — no department-level manager scoping
- No leave carry-forward or encashment logic
- SQLite does not support concurrent writes well — use PostgreSQL for production
- SQLite is suitable for development but not recommended for high-concurrency production environments.
- Email notifications require valid SMTP configuration.
- The application currently supports two user roles (Employee and Manager).

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
- Implement and fully configure email service (SMTP integration) — add comprehensive email templates, retries, and delivery logging
