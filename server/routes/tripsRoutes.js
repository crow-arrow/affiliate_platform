import express from "express"
import { getAllTrips } from "../controllers/getTrips.js"

const router = express.Router()

// http://localhost:3002/api/trips
router.get("/get-all-trips", getAllTrips)


export default router