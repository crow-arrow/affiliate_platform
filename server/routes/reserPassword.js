import express, { Router } from "express";
import { passwordResetLimiter } from "../middleware/rateLimiter.js";
import {
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
} from "../controllers/resetPassword.js";

const router = express.Router();

// Запрос на восстановление пароля - отправляет OTP код
router.post("/request-reset", passwordResetLimiter, requestPasswordReset);

// Проверка OTP кода для восстановления пароля
router.post("/verify-otp", verifyPasswordResetOTP);

// Сброс пароля с токеном, полученным после верификации OTP
router.post("/reset-password", resetPassword);

export default router;
