import employeeRepository from "../repositories/employee.repository.js";
import authRepository from "../repositories/auth.repository.js";
import tokenService from "./token.service.js";

import {
  comparePassword,
} from "../utils/password.js";

import ApiError from "../utils/ApiError.js";

class AuthService {

  /**
   * Employee Login
   */
  async login(email, password) {

    const employee =
      await employeeRepository.findByEmail(email);

    if (!employee) {
      throw new ApiError(
        401,
        "Invalid email or password"
      );
    }

    if (!employee.isActive) {
      throw new ApiError(
        403,
        "Your account has been deactivated."
      );
    }

    const passwordMatched =
      await comparePassword(
        password,
        employee.password
      );

    if (!passwordMatched) {
      throw new ApiError(
        401,
        "Invalid email or password"
      );
    }

    const tokens =
      await tokenService.generateTokens(employee);

    await authRepository.updateLastLogin(
      employee.id
    );

    return {

      employee: {

        id: employee.id,

        employeeCode:
          employee.employeeCode,

        firstName:
          employee.firstName,

        lastName:
          employee.lastName,

        email:
          employee.email,

        role:
          employee.role,

        department:
          employee.department,

      },

      accessToken:
        tokens.accessToken,

      refreshToken:
        tokens.refreshToken,

    };

  }

}

export default new AuthService();