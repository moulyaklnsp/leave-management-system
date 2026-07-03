import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Leave Management System API",
      version: "1.0.0",
      description: "REST API for Employee Leave Management System",
    },
    servers: [{ url: "http://localhost:5000/api", description: "Development server" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@company.com" },
            password: { type: "string", example: "Employee@123" },
          },
        },
        LeaveRequest: {
          type: "object",
          required: ["leaveType", "startDate", "endDate", "reason"],
          properties: {
            leaveType: { type: "string", enum: ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"] },
            startDate: { type: "string", format: "date", example: "2025-09-01" },
            endDate: { type: "string", format: "date", example: "2025-09-03" },
            reason: { type: "string", example: "Family function" },
          },
        },
        RejectRequest: {
          type: "object",
          required: ["managerComments"],
          properties: { managerComments: { type: "string", example: "Insufficient staffing" } },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            statusCode: { type: "integer" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          security: [],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout",
          responses: { 200: { description: "Logged out" } },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          security: [],
          responses: { 200: { description: "Token refreshed" }, 401: { description: "Invalid refresh token" } },
        },
      },
      "/employees": {
        get: {
          tags: ["Employees"],
          summary: "Get all employees (Manager only)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Employees list" }, 403: { description: "Forbidden" } },
        },
      },
      "/employees/profile": {
        get: {
          tags: ["Employees"],
          summary: "Get own profile",
          responses: { 200: { description: "Profile data" } },
        },
      },
      "/employees/{id}": {
        get: {
          tags: ["Employees"],
          summary: "Get employee by ID (Manager only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Employee data" }, 404: { description: "Not found" } },
        },
      },
      "/leaves": {
        post: {
          tags: ["Leaves"],
          summary: "Apply for leave (Employee only)",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LeaveRequest" } } } },
          responses: { 201: { description: "Leave applied" }, 400: { description: "Validation error" } },
        },
        get: {
          tags: ["Leaves"],
          summary: "Get leaves (own for employee, all for manager)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] } },
            { name: "leaveType", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Leaves list" } },
        },
      },
      "/leaves/pending": {
        get: {
          tags: ["Leaves"],
          summary: "Get pending leaves (Manager only)",
          responses: { 200: { description: "Pending leaves" } },
        },
      },
      "/leaves/dashboard/employee": {
        get: {
          tags: ["Dashboard"],
          summary: "Employee dashboard stats",
          responses: { 200: { description: "Dashboard data" } },
        },
      },
      "/leaves/dashboard/manager": {
        get: {
          tags: ["Dashboard"],
          summary: "Manager dashboard stats",
          responses: { 200: { description: "Dashboard data" } },
        },
      },
      "/leaves/{id}": {
        get: {
          tags: ["Leaves"],
          summary: "Get leave by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Leave data" }, 404: { description: "Not found" } },
        },
        put: {
          tags: ["Leaves"],
          summary: "Update pending leave (Employee only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/LeaveRequest" } } } },
          responses: { 200: { description: "Leave updated" } },
        },
        delete: {
          tags: ["Leaves"],
          summary: "Cancel pending leave (Employee only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Leave cancelled" } },
        },
      },
      "/leaves/{id}/approve": {
        put: {
          tags: ["Leaves"],
          summary: "Approve leave (Manager only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Leave approved" } },
        },
      },
      "/leaves/{id}/reject": {
        put: {
          tags: ["Leaves"],
          summary: "Reject leave (Manager only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RejectRequest" } } } },
          responses: { 200: { description: "Leave rejected" } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
