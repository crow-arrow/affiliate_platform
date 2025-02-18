import express from "express"
import { migrateTrips } from "../controllers/tripsController.js"

const router = express.Router();

// Эндпоинт для переноса данных
router.post('/migrate', migrateTrips)

export default router