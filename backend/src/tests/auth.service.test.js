import { jest } from "@jest/globals";

// Mock dependencies
const mockFindByEmail = jest.fn();
const mockUpdateLastLogin = jest.fn();
const mockGenerateTokens = jest.fn();
const mockComparePassword = jest.fn();

jest.unstable_mockModule("../repositories/employee.repository.js", () => ({
  default: { findByEmail: mockFindByEmail },
}));
jest.unstable_mockModule("../repositories/auth.repository.js", () => ({
  default: { updateLastLogin: mockUpdateLastLogin },
}));
jest.unstable_mockModule("./token.service.js", () => ({
  default: { generateTokens: mockGenerateTokens, revokeToken: jest.fn() },
}));
jest.unstable_mockModule("../utils/password.js", () => ({
  comparePassword: mockComparePassword,
}));

const { default: authService } = await import("./auth.service.js");

describe("AuthService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("login", () => {
    const mockEmployee = {
      id: 1,
      employeeCode: "EMP001",
      firstName: "John",
      lastName: "Doe",
      email: "john@company.com",
      password: "hashed",
      role: "EMPLOYEE",
      department: { name: "Engineering" },
      isActive: true,
    };

    it("should return tokens and employee on valid credentials", async () => {
      mockFindByEmail.mockResolvedValue(mockEmployee);
      mockComparePassword.mockResolvedValue(true);
      mockGenerateTokens.mockResolvedValue({ accessToken: "access", refreshToken: "refresh" });
      mockUpdateLastLogin.mockResolvedValue({});

      const result = await authService.login("john@company.com", "password");

      expect(result.employee.email).toBe("john@company.com");
      expect(result.accessToken).toBe("access");
      expect(result.refreshToken).toBe("refresh");
    });

    it("should throw 401 if employee not found", async () => {
      mockFindByEmail.mockResolvedValue(null);
      await expect(authService.login("x@x.com", "pass")).rejects.toMatchObject({ statusCode: 401 });
    });

    it("should throw 403 if account is deactivated", async () => {
      mockFindByEmail.mockResolvedValue({ ...mockEmployee, isActive: false });
      await expect(authService.login("john@company.com", "pass")).rejects.toMatchObject({ statusCode: 403 });
    });

    it("should throw 401 if password does not match", async () => {
      mockFindByEmail.mockResolvedValue(mockEmployee);
      mockComparePassword.mockResolvedValue(false);
      await expect(authService.login("john@company.com", "wrong")).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
