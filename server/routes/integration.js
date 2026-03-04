import express from "express";
import { checkApiKey } from "../middleware/checkApiKey.js";
import { receiveTrips } from "../controllers/integration/trips.js";

const router = express.Router();

// POST /api/integration/trips
// Прием туров от внешних систем
router.post("/trips", checkApiKey, receiveTrips);

export default router;

