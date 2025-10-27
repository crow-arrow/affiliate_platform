import express from "express";
import { getAllTrips } from "../controllers/admin/getTrips.js";
import { checkAuth, checkRole } from "../middleware/checkAuth.js";

const router = express.Router();

// http://localhost:3002/api/trips
router.get("/get-all-trips", checkAuth, checkRole(["ADMIN"]), getAllTrips);

export default router;
