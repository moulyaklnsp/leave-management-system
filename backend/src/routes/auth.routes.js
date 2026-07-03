import express from "express";
import { login, logout, refreshToken } from "../controllers/auth.controller.js";
import { loginValidation } from "../validations/auth.validation.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router;
