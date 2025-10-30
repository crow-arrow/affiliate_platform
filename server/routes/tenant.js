import express from "express";
import { resolveTenant } from "../controllers/tenant/resolveTenant.js";
import { businessSignUp } from "../controllers/tenant/businessSignUp.js";

const router = express.Router();

// GET /api/tenant/resolve-tenant?slug=company
router.get("/resolve-tenant", resolveTenant);

// Create tenant + admin
router.post("/business-sign-up", businessSignUp);

export default router;


