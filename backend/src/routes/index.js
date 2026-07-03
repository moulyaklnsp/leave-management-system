import express from "express";
import authRoutes from "./auth.routes.js";
import employeeRoutes from "./employee.routes.js";
import leaveRoutes from "./leave.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/leaves", leaveRoutes);

export default router;
