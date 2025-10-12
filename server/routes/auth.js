import express from "express";
import { signUp, login, oauthLogin, getMe } from "../controllers/auth.js";
import { passwordResetLimiter } from "../middleware/rateLimiter.js";
import {
  verifyEmail,
  resendEmailController,
} from "../controllers/emailController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { clerkMiddleware } from "@clerk/express";

const router = express.Router();

//Register
// http://localhost:3002/api/auth/sign-up
router.post("/sign-up", signUp);

// http://localhost:3002/api/auth/verify-email
router.get("/verify-email/:token", verifyEmail);

// http://localhost:3002/api/auth/resend-email
router.post("/resend-email", passwordResetLimiter, resendEmailController);

// Login
// http://localhost:3002/api/auth/sign-in
router.post("/sign-in", login);

// OAuth Login with Clerk
// http://localhost:3002/api/auth/oauth-login
router.post("/oauth-login", clerkMiddleware(), oauthLogin, (req, res, next) => {
  console.log("=== HIT OAUTH-LOGIN ROUTE ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  next();
});

// Get Me
// http://localhost:3002/api/auth/me
router.get("/me", checkAuth, getMe);

export default router;
