import express, { Router } from "express";
import { passwordResetLimiter } from "../middleware/rateLimiter.js";
import {
  requestPasswordReset,
  checkResetLink,
  resetPassword,
} from "../controllers/resetPassword.js";

const router = express.Router();

router.post("/request-reset", passwordResetLimiter, requestPasswordReset);
router.post("/check-reset-link", checkResetLink);
router.post("/reset-password/:token", resetPassword);

export default router;
