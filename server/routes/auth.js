import express from "express";
import { signUp, login, getMe } from "../controllers/auth.js";
import { sendVerificationEmail } from "../controllers/emailController.js";
import { verifyEmail } from "../controllers/emailController.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = express.Router();

//Register
// http://localhost:3002/api/auth/signup
router.post("/signup", signUp);

// Email Confirmation
router.post("/send-verification-email", signUp);

// http://localhost:3002/api/auth/verify-email
router.get("/verify-email/:token", verifyEmail);

// Login
// http://localhost:3002/api/auth/login
router.post("/login", login);

// Get Me
// http://localhost:3002/api/auth/me
router.get("/me", checkAuth, getMe);

export default router;
