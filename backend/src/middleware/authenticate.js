import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import env from "../config/env.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    );

    const employee = await prisma.employee.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        department: true,
      },
    });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = employee;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;