import express from "express";
import { signUp, login, oauthLogin, getMe, getUserTenants, getMyTenants } from "../controllers/auth.js";
import { businessSignUp } from "../controllers/tenant/businessSignUp.js";
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
router.post("/oauth-login", clerkMiddleware(), oauthLogin);

// Вернуть все компании, где у пользователя с таким email есть аккаунт
router.get("/user/tenants", getUserTenants);

// Вернуть компании текущего пользователя (по JWT)
router.get("/my-tenants", checkAuth, getMyTenants);

// Get Me
// http://localhost:3002/api/auth/me
router.get("/me", checkAuth, getMe);

export default router;
