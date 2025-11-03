import express from "express";
import { resolveTenant } from "../controllers/tenant/resolveTenant.js";
import { businessSignUp } from "../controllers/tenant/businessSignUp.js";
import { checkWorkspaceName } from "../controllers/tenant/checkWorkspaceName.js";

const router = express.Router();

// GET /api/tenant/resolve-tenant?slug=company
router.get("/resolve-tenant", resolveTenant);

// GET /api/tenant/check-name?name=CompanyName
router.get("/check-name", checkWorkspaceName);

// Create tenant + admin
router.post("/business-sign-up", businessSignUp);

export default router;


