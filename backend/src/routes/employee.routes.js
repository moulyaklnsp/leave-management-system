import express from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { getAllEmployees, getEmployeeById, getProfile } from "../controllers/employee.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.get("/", authorize("MANAGER"), getAllEmployees);
router.get("/:id", authorize("MANAGER"), getEmployeeById);

export default router;
