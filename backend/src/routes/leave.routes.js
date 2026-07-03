import express from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  applyLeaveValidation,
  updateLeaveValidation,
  rejectLeaveValidation,
} from "../validations/leave.validation.js";
import {
  applyLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  cancelLeave,
  approveLeave,
  rejectLeave,
  getPendingLeaves,
  getEmployeeDashboard,
  getManagerDashboard,
} from "../controllers/leave.controller.js";

const router = express.Router();

router.use(authenticate);

// Dashboard
router.get("/dashboard/employee", authorize("EMPLOYEE"), getEmployeeDashboard);
router.get("/dashboard/manager", authorize("MANAGER"), getManagerDashboard);

// Leave CRUD
router.post("/", authorize("EMPLOYEE"), applyLeaveValidation, validateRequest, applyLeave);
router.get("/", getLeaves);
router.get("/pending", authorize("MANAGER"), getPendingLeaves);
router.get("/:id", getLeaveById);
router.put("/:id", authorize("EMPLOYEE"), updateLeaveValidation, validateRequest, updateLeave);
router.delete("/:id", authorize("EMPLOYEE"), cancelLeave);

// Manager actions
router.put("/:id/approve", authorize("MANAGER"), approveLeave);
router.put("/:id/reject", authorize("MANAGER"), rejectLeaveValidation, validateRequest, rejectLeave);

export default router;
