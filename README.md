# Employee Leave Management System

A full-stack Leave Management System built with React, Node.js/Express, Prisma ORM, and SQLite. Enables employees to apply for leave and managers to review, approve, or reject requests.

---

## Features

### Employee
- Secure JWT login/logout
- Dashboard with leave stats and balance
- Apply for leave (Casual, Sick, Earned, Maternity, Paternity, Unpaid)
- View, search, and filter leave history
- Edit or cancel pending leave requests

### Manager
- Dashboard with team-wide stats
- View and search all employees
- Review pending leave requests
- Approve or reject with comments
- Filter all leave records by type/status

### System
- JWT Authentication with Refresh Token rotation
- Role-Based Access Control (EMPLOYEE / MANAGER)
- Leave balance tracking with auto-deduction on approval
- Overlap detection for leave requests
- Audit logs for all actions
- Swagger/OpenAPI documentation at `/api-docs`
- Dark mode toggle
- Responsive design (mobile-friendly)
- Rate limiting, Helmet security headers
- Winston logging
- Docker support
- GitHub Actions CI/CD
- Unit & Integration tests

---

## Technology Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, React Router v7, React Hook Form, Axios, React Toastify |
| Backend    | Node.js, Express 5, Prisma ORM      |
| Database   | SQLite (via Prisma)                 |
| Auth       | JWT (Access + Refresh tokens), bcryptjs |
| Docs       | Swagger UI / OpenAPI 3.0            |
| DevOps     | Docker, Docker Compose, GitHub Actions |
| Testing    | Jest, Supertest                     |

---

## Folder Structure

```
leave-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.js              # Seed data
│   │   └── migrations/
│   └── src/
│       ├── config/              # env, logger, prisma client
│       ├── controllers/         # Route handlers
│       ├── middleware/          # auth, authorize, error, rate limit
│       ├── repositories/        # DB access layer
│       ├── routes/              # Express routers
│       ├── services/            # Business logic
│       ├── swagger/             # OpenAPI spec
│       ├── tests/               # Unit & integration tests
│       ├── utils/               # ApiError, ApiResponse, jwt, password
│       ├── validations/         # express-validator rules
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── contexts/            # AuthContext
│       ├── layouts/             # DashboardLayout
│       ├── pages/               # All page components
│       ├── services/            # API call functions
│       └── utils/               # helpers
├── .github/workflows/ci.yml     # GitHub Actions
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd leave-management-system
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env        # or edit .env directly
npm install
npx prisma migrate dev --name init
node prisma/seed.js         # seed demo data
npm run dev                 # starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./database/leave.db"
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running with Docker

```bash
# From the root directory
cp .env.example .env   # fill in JWT secrets
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

---

## Running Tests

```bash
cd backend
npm test
```

---

## API Documentation

Swagger UI is available at: **http://localhost:5000/api-docs**

### Key Endpoints

| Method | Endpoint                    | Role     | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | /api/auth/login             | Public   | Login                    |
| POST   | /api/auth/logout            | Auth     | Logout                   |
| POST   | /api/auth/refresh           | Public   | Refresh access token     |
| GET    | /api/employees/profile      | Auth     | Get own profile          |
| GET    | /api/employees              | Manager  | List all employees       |
| GET    | /api/employees/:id          | Manager  | Get employee by ID       |
| POST   | /api/leaves                 | Employee | Apply for leave          |
| GET    | /api/leaves                 | Auth     | Get leaves (own/all)     |
| GET    | /api/leaves/:id             | Auth     | Get leave by ID          |
| PUT    | /api/leaves/:id             | Employee | Update pending leave     |
| DELETE | /api/leaves/:id             | Employee | Cancel pending leave     |
| GET    | /api/leaves/pending         | Manager  | Get pending leaves       |
| PUT    | /api/leaves/:id/approve     | Manager  | Approve leave            |
| PUT    | /api/leaves/:id/reject      | Manager  | Reject leave             |
| GET    | /api/leaves/dashboard/employee | Employee | Employee dashboard    |
| GET    | /api/leaves/dashboard/manager  | Manager  | Manager dashboard     |

---

## Sample Login Credentials

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Manager  | manager@company.com    | Manager@123   |
| Employee | john@company.com       | Employee@123  |
| Employee | jane@company.com       | Employee@123  |

---

## Database Schema

### Employee
- id, employeeCode, firstName, lastName, email, password, departmentId, role (EMPLOYEE/MANAGER), isActive, isDeleted, createdAt, updatedAt

### Department
- id, name, createdAt

### Leave
- id, employeeId, approvedById, leaveType, startDate, endDate, totalDays, reason, status, managerComments, approvedAt, appliedAt, updatedAt

### LeaveBalance
- id, employeeId, casual, sick, earned, maternity, paternity, unpaid, updatedAt

### RefreshToken
- id, token, employeeId, expiresAt, createdAt

### AuditLog
- id, employeeId, action, entity, entityId, description, ipAddress, createdAt

---

## Assumptions

- SQLite is used for simplicity; can be swapped to PostgreSQL by changing `provider` in `schema.prisma`
- Leave balance is deducted only on approval, not on application
- Working days are Mon–Fri; weekends are excluded from day count
- Managers cannot apply for leave (role-based restriction)
- Refresh tokens are rotated on each use (one-time use)

## Known Limitations

- No email notification implementation (SMTP config is present but email sending is not wired to leave events)
- No file attachment support for leave applications
- Single manager role — no department-level manager scoping

## Future Enhancements

- Email notifications on leave status changes
- Leave encashment and carry-forward logic
- Department-level manager assignment
- Calendar view for leave visualization
- Mobile app (React Native)
- PostgreSQL migration for production scale
