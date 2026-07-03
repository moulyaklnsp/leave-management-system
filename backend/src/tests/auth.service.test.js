import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockFindByEmail = jest.fn();
const mockUpdateLastLogin = jest.fn();
const mockGenerateTokens = jest.fn();
const mockRevokeToken = jest.fn();
const mockComparePassword = jest.fn();

jest.unstable_mockModule("../repositories/employee.repository.js", () => ({
  default: { findByEmail: mockFindByEmail },
}));

jest.unstable_mockModule("../repositories/auth.repository.js", () => ({
  default: { updateLastLogin: mockUpdateLastLogin },
}));

jest.unstable_mockModule("../services/token.service.js", () => ({
  default: { generateTokens: mockGenerateTokens, revokeToken: mockRevokeToken },
}));

jest.unstable_mockModule("../utils/password.js", () => ({
  comparePassword: mockComparePassword,
}));

const { default: authService } = await import("../services/auth.service.js");

const mockEmployee = {
  id: 1,
  employeeCode: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john@company.com",
  password: "hashed_password",
  role: "EMPLOYEE",
  department: { name: "Engineering" },
  isActive: true,
};

describe("AuthService.login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns tokens and employee data on valid credentials", async () => {
    mockFindByEmail.mockResolvedValue(mockEmployee);
    mockComparePassword.mockResolvedValue(true);
    mockGenerateTokens.mockResolvedValue({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });
    mockUpdateLastLogin.mockResolvedValue({});

    const result = await authService.login("john@company.com", "password123");

    expect(result.employee.email).toBe("john@company.com");
    expect(result.accessToken).toBe("access_token");
    expect(result.refreshToken).toBe("refresh_token");
    expect(mockGenerateTokens).toHaveBeenCalledWith(mockEmployee);
    expect(mockUpdateLastLogin).toHaveBeenCalledWith(1);
  });

  it("throws 401 when employee is not found", async () => {
    mockFindByEmail.mockResolvedValue(null);

    await expect(authService.login("unknown@company.com", "pass")).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });
  });

  it("throws 403 when account is deactivated", async () => {
    mockFindByEmail.mockResolvedValue({ ...mockEmployee, isActive: false });

    await expect(authService.login("john@company.com", "pass")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("throws 401 when password does not match", async () => {
    mockFindByEmail.mockResolvedValue(mockEmployee);
    mockComparePassword.mockResolvedValue(false);

    await expect(authService.login("john@company.com", "wrongpass")).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });
  });
});

describe("AuthService.logout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls revokeToken when refresh token is provided", async () => {
    mockRevokeToken.mockResolvedValue();
    await authService.logout("some_refresh_token");
    expect(mockRevokeToken).toHaveBeenCalledWith("some_refresh_token");
  });

  it("does not throw when no refresh token is provided", async () => {
    await expect(authService.logout(null)).resolves.toBeUndefined();
  });
});
