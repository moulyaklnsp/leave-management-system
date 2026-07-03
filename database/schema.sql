-- ============================================================
-- Employee Leave Management System — Database Schema
-- Provider : SQLite (via Prisma ORM)
-- ============================================================

-- Department
CREATE TABLE "Department" (
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"      TEXT     NOT NULL UNIQUE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Employee
CREATE TABLE "Employee" (
    "id"           INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeCode" TEXT     NOT NULL UNIQUE,
    "firstName"    TEXT     NOT NULL,
    "lastName"     TEXT     NOT NULL,
    "email"        TEXT     NOT NULL UNIQUE,
    "password"     TEXT     NOT NULL,
    "departmentId" INTEGER  NOT NULL,
    "role"         TEXT     NOT NULL DEFAULT 'EMPLOYEE', -- EMPLOYEE | MANAGER
    "isActive"     BOOLEAN  NOT NULL DEFAULT true,
    "isDeleted"    BOOLEAN  NOT NULL DEFAULT false,
    "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    DATETIME NOT NULL,
    CONSTRAINT "Employee_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "Department" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- Leave
CREATE TABLE "Leave" (
    "id"              INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId"      INTEGER  NOT NULL,
    "approvedById"    INTEGER,
    "leaveType"       TEXT     NOT NULL, -- CASUAL | SICK | EARNED | MATERNITY | PATERNITY | UNPAID
    "startDate"       DATETIME NOT NULL,
    "endDate"         DATETIME NOT NULL,
    "totalDays"       INTEGER  NOT NULL,
    "reason"          TEXT     NOT NULL,
    "status"          TEXT     NOT NULL DEFAULT 'PENDING', -- PENDING | APPROVED | REJECTED | CANCELLED
    "managerComments" TEXT,
    "approvedAt"      DATETIME,
    "appliedAt"       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       DATETIME NOT NULL,
    CONSTRAINT "Leave_employeeId_fkey"
        FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Leave_approvedById_fkey"
        FOREIGN KEY ("approvedById") REFERENCES "Employee" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Leave_employeeId_idx"   ON "Leave"("employeeId");
CREATE INDEX "Leave_approvedById_idx" ON "Leave"("approvedById");
CREATE INDEX "Leave_status_idx"       ON "Leave"("status");

-- LeaveBalance
CREATE TABLE "LeaveBalance" (
    "id"         INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER  NOT NULL UNIQUE,
    "casual"     INTEGER  NOT NULL DEFAULT 10,
    "sick"       INTEGER  NOT NULL DEFAULT 10,
    "earned"     INTEGER  NOT NULL DEFAULT 15,
    "maternity"  INTEGER  NOT NULL DEFAULT 180,
    "paternity"  INTEGER  NOT NULL DEFAULT 15,
    "unpaid"     INTEGER  NOT NULL DEFAULT 999,
    "updatedAt"  DATETIME NOT NULL,
    CONSTRAINT "LeaveBalance_employeeId_fkey"
        FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RefreshToken
CREATE TABLE "RefreshToken" (
    "id"         INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token"      TEXT     NOT NULL UNIQUE,
    "employeeId" INTEGER  NOT NULL,
    "expiresAt"  DATETIME NOT NULL,
    "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_employeeId_fkey"
        FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "RefreshToken_employeeId_idx" ON "RefreshToken"("employeeId");

-- AuditLog
CREATE TABLE "AuditLog" (
    "id"          INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId"  INTEGER  NOT NULL,
    "action"      TEXT     NOT NULL,
    "entity"      TEXT     NOT NULL,
    "entityId"    INTEGER  NOT NULL,
    "description" TEXT,
    "ipAddress"   TEXT,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_employeeId_fkey"
        FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "AuditLog_employeeId_idx" ON "AuditLog"("employeeId");

-- EmailLog
CREATE TABLE "EmailLog" (
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipient" TEXT     NOT NULL,
    "subject"   TEXT     NOT NULL,
    "status"    TEXT     NOT NULL, -- SENT | FAILED
    "sentAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notification
CREATE TABLE "Notification" (
    "id"         INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER  NOT NULL,
    "title"      TEXT     NOT NULL,
    "message"    TEXT     NOT NULL,
    "isRead"     BOOLEAN  NOT NULL DEFAULT false,
    "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_employeeId_fkey"
        FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- PasswordResetToken
CREATE TABLE "PasswordResetToken" (
    "id"         INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token"      TEXT     NOT NULL UNIQUE,
    "employeeId" INTEGER  NOT NULL,
    "expiresAt"  DATETIME NOT NULL,
    "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_employeeId_fkey"
        FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "PasswordResetToken_employeeId_idx" ON "PasswordResetToken"("employeeId");
