import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from "./routes/auth.js"
import tripsRoutes from "./routes/tripsRoutes.js"
import userTripsRoutes from "./routes/userTripsRoutes.js"
import assignCouponRoute from "./routes/assignCouponRoute.js"

dotenv.config()

const app = express()
app.use(express.json())

// Constants
const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER || "defaultUser"
const DB_PASSWORD = process.env.DB_PASSWORD || "defaultPassword"
const DB_NAME = process.env.DB_NAME || "defaultDB"

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/trips", tripsRoutes)
app.use("/api/user-trips", userTripsRoutes)
app.use("/api/assign-coupon", assignCouponRoute)

// Start Server
async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@jinn.0vrj2.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Jinn`
        )

        console.log("✅ Connected to MongoDB")

        app.listen(PORT, () => console.log(`🚀 Server started on port: ${PORT}`))
    } catch (error) {
        console.error("❌ Error connecting to the database:", error)
        process.exit(1); // Остановка сервера при ошибке
    }
}

start()