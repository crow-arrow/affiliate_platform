import express from "express";
import { signUp, verifyEmail, login, getMe } from "../controllers/auth.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = express.Router();

//Register
// http://localhost:3002/api/auth/signup
router.post("/signup", signUp);
// Email Confirmation
// http://localhost:3002/api/auth/verify-email
router.get("/verify-email", verifyEmail);

// Login
// http://localhost:3002/api/auth/login
router.post("/login", login);

// Get Me
// http://localhost:3002/api/auth/me
router.get("/me", checkAuth, getMe);

export default router;
