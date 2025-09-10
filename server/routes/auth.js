import { requireAuth } from "@clerk/express";
import express from "express";
import { signUp, login, oauthLogin, getMe } from "../controllers/auth.js";
import { passwordResetLimiter } from "../middleware/rateLimiter.js";
import {
  verifyEmail,
  resendEmailController,
} from "../controllers/emailController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

//Register
// http://localhost:3002/api/auth/signup
router.post("/signup", signUp);

// http://localhost:3002/api/auth/verify-email
router.get("/verify-email/:token", verifyEmail);

// http://localhost:3002/api/auth/resend-email
router.post("/resend-email", passwordResetLimiter, resendEmailController);

// Login
// http://localhost:3002/api/auth/login
router.post("/login", login);

// OAuth Login with Clerk
// http://localhost:3002/api/auth/clerk-login
router.post("/oauth-login", requireAuth(), oauthLogin);

// Get Me
// http://localhost:3002/api/auth/me
router.get("/me", checkAuth, getMe);

export default router;
