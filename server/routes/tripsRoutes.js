import express from "express"
import { migrateTrips } from "../controllers/tripsController.js"
import { checkAuth } from '../utils/checkAuth.js'
import { getAllTrips, getUserTrips } from "../controllers/getTrips.js"

const router = express.Router()

// http://localhost:3002/api/trips
router.post('/migrate', migrateTrips)
router.post("/webhook/migrate-trips", async (req, res) => {
    console.log("📩 Webhook received, starting migration...")
    await migrateTrips(req, res);
})

router.get("/get-all-trips", getAllTrips)
router.get("/get-trips", checkAuth, getUserTrips)

export default router