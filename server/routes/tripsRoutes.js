import express from "express";
import { getAllTrips } from "../controllers/admin/getTrips.js";
import { checkAuth, checkRole } from "../middleware/checkAuth.js";
import { resolveTenantFromHeader } from "../middleware/resolveTenantFromHeader.js";

const router = express.Router();

// Все роуты требуют аутентификации, проверки роли и резолвят tenant из заголовка
router.use(checkAuth);
router.use(resolveTenantFromHeader);

// http://localhost:3002/api/trips
router.get("/get-all-trips", checkRole(["ADMIN"]), getAllTrips);

export default router;
