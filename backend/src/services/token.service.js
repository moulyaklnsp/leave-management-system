import refreshTokenRepository from "../repositories/refreshToken.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

class TokenService {
  /**
   * Generate Access & Refresh Tokens
   */
  async generateTokens(employee) {
    const accessToken = generateAccessToken(employee);

    const refreshToken = generateRefreshToken(employee);

    const decoded = verifyRefreshToken(refreshToken);

    await refreshTokenRepository.create(
      refreshToken,
      employee.id,
      new Date(decoded.exp * 1000)
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate Refresh Token
   */
  async rotateRefreshToken(oldToken) {
    const storedToken =
      await refreshTokenRepository.findByToken(oldToken);

    if (!storedToken) {
      throw new Error("Refresh token not found.");
    }

    const decoded = verifyRefreshToken(oldToken);

    await refreshTokenRepository.deleteByToken(oldToken);

    const employee = storedToken.employee;

    const accessToken =
      generateAccessToken(employee);

    const refreshToken =
      generateRefreshToken(employee);

    const decodedNew =
      verifyRefreshToken(refreshToken);

    await refreshTokenRepository.create(
      refreshToken,
      employee.id,
      new Date(decodedNew.exp * 1000)
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout
   */
  async revokeToken(token) {
    await refreshTokenRepository.deleteByToken(token);
  }

  /**
   * Logout from all devices
   */
  async revokeAll(employeeId) {
    await refreshTokenRepository.deleteAllForEmployee(
      employeeId
    );
  }
}

export default new TokenService();