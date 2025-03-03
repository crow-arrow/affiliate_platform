import express from "express"
import { checkAuth } from '../utils/checkAuth.js'
import { getAllTrips, getUserTrips } from "../controllers/getTrips.js"

const router = express.Router()

// http://localhost:3002/api/trips
router.get("/get-all-trips", getAllTrips)
router.get("/get-trips", checkAuth, getUserTrips)

export default router