import express from "express";

import { login } from "../controllers/auth.controller.js";

import {
    loginValidation,
} from "../validations/auth.validation.js";

import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
    "/login",
    loginValidation,
    validateRequest,
    login
);

export default router;