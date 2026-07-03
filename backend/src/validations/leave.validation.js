import { body } from "express-validator";

export const applyLeaveValidation = [
  body("leaveType")
    .isIn(["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"])
    .withMessage("Invalid leave type"),
  body("startDate").isISO8601().withMessage("Valid start date required"),
  body("endDate").isISO8601().withMessage("Valid end date required"),
  body("reason").trim().notEmpty().withMessage("Reason is required")
    .isLength({ max: 500 }).withMessage("Reason must be under 500 characters"),
];

export const updateLeaveValidation = [
  body("leaveType")
    .optional()
    .isIn(["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"])
    .withMessage("Invalid leave type"),
  body("startDate").optional().isISO8601().withMessage("Valid start date required"),
  body("endDate").optional().isISO8601().withMessage("Valid end date required"),
  body("reason").optional().trim().notEmpty().withMessage("Reason cannot be empty"),
];

export const rejectLeaveValidation = [
  body("managerComments").trim().notEmpty().withMessage("Rejection reason is required"),
];
