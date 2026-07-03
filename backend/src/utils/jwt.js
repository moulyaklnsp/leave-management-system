import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (employee) => {
  return jwt.sign(
    {
      id: employee.id,
      role: employee.role,
      email: employee.email,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (employee) => {
  return jwt.sign(
    {
      id: employee.id,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};