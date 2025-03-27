import express, { Router } from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/resetPassword.js";

const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
