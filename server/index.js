import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import tripsRoutes from "./routes/tripsRoutes.js";
import assignCouponRoute from "./routes/assignCouponRoute.js";
import User from "./models/User.js";
import Trips from "./models/Trips.js";

dotenv.config();

const app = express();
app.use(express.json());

// Constants
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(
  express.json({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripsRoutes);
// app.use("/api/assign-coupon", assignCouponRoute);
app.use(express.static("uploads"));

// Start Server
async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL");

    // Синхронизируем только модель ReferralUser (например, если вам нужно изменить структуру таблицы)
    await User.sync({ alter: true }); // Только для этой модели

    // Для других моделей не вызывайте sync(), чтобы избежать изменений в таблицах, которые не должны изменяться
    // await TourmasterOrder.sync();  // Не нужно вызывать для этой модели

    app.listen(PORT, () => console.log(`🚀 Server started on port: ${PORT}`));
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
  }
}

start();
