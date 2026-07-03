import request from "supertest";
import app from "../app.js";
import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/password.js";

beforeAll(async () => {
  // Ensure test department and employee exist
  const dept = await prisma.department.upsert({
    where: { name: "Test Dept" },
    update: {},
    create: { name: "Test Dept" },
  });

  await prisma.employee.upsert({
    where: { email: "test@company.com" },
    update: {},
    create: {
      employeeCode: "TEST001",
      firstName: "Test",
      lastName: "User",
      email: "test@company.com",
      password: await hashPassword("Test@1234"),
      departmentId: dept.id,
      role: "EMPLOYEE",
      leaveBalance: { create: {} },
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/auth/login", () => {
  it("should return 200 with tokens on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@company.com", password: "Test@1234" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.employee.email).toBe("test@company.com");
  });

  it("should return 401 on invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@company.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 on missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notanemail" });

    expect(res.status).toBe(400);
  });
});
