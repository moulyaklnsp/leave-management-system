import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Leave Management System API",
      version: "1.0.0",
      description: "REST API for Employee Leave Management System",
      contact: {
        name: "LMS Support",
        email: "support@company.com",
      },
    },
    servers: [
      { url: "http://localhost:5000/api", description: "Development server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@company.com" },
            password: { type: "string", example: "Employee@123" },
          },
        },
        LeaveRequest: {
          type: "object",
          required: ["leaveType", "startDate", "endDate", "reason"],
          properties: {
            leaveType: {
              type: "string",
              enum: ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"],
              example: "CASUAL",
            },
            startDate: { type: "string", format: "date", example: "2025-09-01" },
            endDate: { type: "string", format: "date", example: "2025-09-03" },
            reason: { type: "string", example: "Family function" },
          },
        },
        UpdateLeaveRequest: {
          type: "object",
          properties: {
            leaveType: {
              type: "string",
              enum: ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"],
            },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            reason: { type: "string" },
          },
        },
        RejectRequest: {
          type: "object",
          required: ["managerComments"],
          properties: {
            managerComments: { type: "string", example: "Insufficient staffing during that period" },
          },
        },
        Employee: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            employeeCode: { type: "string", example: "EMP001" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@company.com" },
            role: { type: "string", enum: ["EMPLOYEE", "MANAGER"] },
            department: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string", example: "Engineering" },
              },
            },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Leave: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            employeeId: { type: "integer", example: 2 },
            leaveType: { type: "string", example: "CASUAL" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            totalDays: { type: "integer", example: 2 },
            reason: { type: "string", example: "Family function" },
            status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] },
            managerComments: { type: "string", nullable: true },
            appliedAt: { type: "string", format: "date-time" },
          },
        },
        LeaveBalance: {
          type: "object",
          properties: {
            casual: { type: "integer", example: 10 },
            sick: { type: "integer", example: 10 },
            earned: { type: "integer", example: 15 },
            maternity: { type: "integer", example: 180 },
            paternity: { type: "integer", example: 15 },
            unpaid: { type: "integer", example: 999 },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            total: { type: "integer", example: 50 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            pages: { type: "integer", example: 5 },
          },
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
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Employees", description: "Employee management" },
      { name: "Leaves", description: "Leave request management" },
      { name: "Dashboard", description: "Dashboard statistics" },
    ],
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              employee: { $ref: "#/components/schemas/Employee" },
                              accessToken: { type: "string" },
                            },
                          },
                        },
                      },
                    ],
                  },
                  example: {
                    success: true,
                    statusCode: 200,
                    message: "Login successful",
                    data: {
                      employee: { id: 1, firstName: "John", lastName: "Doe", email: "john@company.com", role: "EMPLOYEE" },
                      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
            400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Account deactivated", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout and revoke refresh token",
          responses: {
            200: { description: "Logged out successfully" },
          },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token using httpOnly cookie",
          security: [],
          responses: {
            200: {
              description: "New access token issued",
              content: {
                "application/json": {
                  example: { success: true, data: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." } },
                },
              },
            },
            401: { description: "Invalid or expired refresh token" },
          },
        },
      },
      "/employees/profile": {
        get: {
          tags: ["Employees"],
          summary: "Get own profile with leave balance",
          responses: {
            200: {
              description: "Profile fetched",
              content: {
                "application/json": {
                  schema: { allOf: [{ $ref: "#/components/schemas/ApiResponse" }, { properties: { data: { $ref: "#/components/schemas/Employee" } } }] },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/employees": {
        get: {
          tags: ["Employees"],
          summary: "Get all employees — Manager only",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "search", in: "query", description: "Search by name or email", schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Employees list with pagination",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    data: {
                      employees: [{ id: 2, firstName: "John", lastName: "Doe", email: "john@company.com", role: "EMPLOYEE" }],
                      pagination: { total: 5, page: 1, limit: 10, pages: 1 },
                    },
                  },
                },
              },
            },
            403: { description: "Forbidden — Manager role required" },
          },
        },
      },
      "/employees/{id}": {
        get: {
          tags: ["Employees"],
          summary: "Get employee by ID — Manager only",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 2 }],
          responses: {
            200: { description: "Employee data" },
            404: { description: "Employee not found" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/leaves/dashboard/employee": {
        get: {
          tags: ["Dashboard"],
          summary: "Employee dashboard — stats, balance, recent leaves",
          responses: {
            200: {
              description: "Dashboard data",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    data: {
                      stats: { total: 5, approved: 2, pending: 1, rejected: 1, cancelled: 1 },
                      leaveBalance: { casual: 8, sick: 10, earned: 15, maternity: 180, paternity: 15, unpaid: 999 },
                      recentLeaves: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/leaves/dashboard/manager": {
        get: {
          tags: ["Dashboard"],
          summary: "Manager dashboard — team stats and recent activities",
          responses: {
            200: {
              description: "Dashboard data",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    data: {
                      stats: { totalEmployees: 10, pendingApprovals: 3, approved: 20, rejected: 5 },
                      recentActivities: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/leaves": {
        post: {
          tags: ["Leaves"],
          summary: "Apply for leave — Employee only",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LeaveRequest" } } },
          },
          responses: {
            201: { description: "Leave applied successfully" },
            400: { description: "Validation error / insufficient balance / past date / no working days" },
            409: { description: "Overlapping leave exists" },
          },
        },
        get: {
          tags: ["Leaves"],
          summary: "Get leaves — own for Employee, all for Manager",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] } },
            { name: "leaveType", in: "query", schema: { type: "string", enum: ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"] } },
            { name: "search", in: "query", description: "Search by employee name or email (Manager only)", schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Paginated leaves list",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    data: {
                      leaves: [],
                      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/leaves/pending": {
        get: {
          tags: ["Leaves"],
          summary: "Get all pending leave requests — Manager only",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Pending leaves list" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/leaves/{id}": {
        get: {
          tags: ["Leaves"],
          summary: "Get leave by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Leave details" },
            403: { description: "Access denied — Employee can only view own leaves" },
            404: { description: "Leave not found" },
          },
        },
        put: {
          tags: ["Leaves"],
          summary: "Update pending leave — Employee only",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateLeaveRequest" } } },
          },
          responses: {
            200: { description: "Leave updated" },
            400: { description: "Leave is not in PENDING status" },
            403: { description: "Access denied" },
            404: { description: "Leave not found" },
          },
        },
        delete: {
          tags: ["Leaves"],
          summary: "Cancel pending leave — Employee only",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Leave cancelled" },
            400: { description: "Only pending leaves can be cancelled" },
            403: { description: "Access denied" },
            404: { description: "Leave not found" },
          },
        },
      },
      "/leaves/{id}/approve": {
        put: {
          tags: ["Leaves"],
          summary: "Approve a pending leave — Manager only",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Leave approved and balance deducted" },
            400: { description: "Leave is not in PENDING status" },
            403: { description: "Forbidden" },
            404: { description: "Leave not found" },
          },
        },
      },
      "/leaves/{id}/reject": {
        put: {
          tags: ["Leaves"],
          summary: "Reject a pending leave with comments — Manager only",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/RejectRequest" } } },
          },
          responses: {
            200: { description: "Leave rejected" },
            400: { description: "Leave is not in PENDING status or missing comments" },
            403: { description: "Forbidden" },
            404: { description: "Leave not found" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
