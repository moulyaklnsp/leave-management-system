import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Departments
  const departments = await Promise.all([
    prisma.department.upsert({ where: { name: "Engineering" }, update: {}, create: { name: "Engineering" } }),
    prisma.department.upsert({ where: { name: "Human Resources" }, update: {}, create: { name: "Human Resources" } }),
    prisma.department.upsert({ where: { name: "Finance" }, update: {}, create: { name: "Finance" } }),
    prisma.department.upsert({ where: { name: "Marketing" }, update: {}, create: { name: "Marketing" } }),
  ]);

  const hash = (p) => bcrypt.hash(p, 12);

  // Manager
  const manager = await prisma.employee.upsert({
    where: { email: "manager@company.com" },
    update: {},
    create: {
      employeeCode: "EMP001",
      firstName: "Alice",
      lastName: "Manager",
      email: "manager@company.com",
      password: await hash("Manager@123"),
      departmentId: departments[0].id,
      role: "MANAGER",
      leaveBalance: { create: {} },
    },
  });

  // Employees
  const emp1 = await prisma.employee.upsert({
    where: { email: "john@company.com" },
    update: {},
    create: {
      employeeCode: "EMP002",
      firstName: "John",
      lastName: "Doe",
      email: "john@company.com",
      password: await hash("Employee@123"),
      departmentId: departments[0].id,
      role: "EMPLOYEE",
      leaveBalance: { create: {} },
    },
  });

  const emp2 = await prisma.employee.upsert({
    where: { email: "jane@company.com" },
    update: {},
    create: {
      employeeCode: "EMP003",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@company.com",
      password: await hash("Employee@123"),
      departmentId: departments[1].id,
      role: "EMPLOYEE",
      leaveBalance: { create: {} },
    },
  });

  // Sample leaves
  await prisma.leave.createMany({
    data: [
      {
        employeeId: emp1.id,
        leaveType: "CASUAL",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-08-02"),
        totalDays: 2,
        reason: "Personal work",
        status: "APPROVED",
        approvedById: manager.id,
        approvedAt: new Date(),
        managerComments: "Approved",
      },
      {
        employeeId: emp1.id,
        leaveType: "SICK",
        startDate: new Date("2025-09-10"),
        endDate: new Date("2025-09-10"),
        totalDays: 1,
        reason: "Fever",
        status: "PENDING",
      },
      {
        employeeId: emp2.id,
        leaveType: "EARNED",
        startDate: new Date("2025-08-15"),
        endDate: new Date("2025-08-20"),
        totalDays: 6,
        reason: "Vacation",
        status: "REJECTED",
        approvedById: manager.id,
        managerComments: "Insufficient notice",
      },
    ],
  });

  console.log("✅ Seed complete");
  console.log("Manager: manager@company.com / Manager@123");
  console.log("Employee: john@company.com / Employee@123");
  console.log("Employee: jane@company.com / Employee@123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
