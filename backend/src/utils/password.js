import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash plain password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain password with hash
 */
export const comparePassword = async (
  password,
  hashedPassword
) => {
  return bcrypt.compare(password, hashedPassword);
};