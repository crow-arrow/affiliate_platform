import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "./config/database.js";
import "./models/associations.js";
import authRoutes from "./routes/auth.js";
import resetPasswordRoutes from "./routes/reserPassword.js";
import userRoutes from "./routes/userRoutes.js";
import tripsRoutes from "./routes/tripsRoutes.js";
import User from "./models/User.js";
import LevelHistory from "./models/LevelHistory.js";
import fileRoutes from "./routes/fileRoutes.js";
import saveClickData from "./routes/saveClickData.js";

dotenv.config();

const app = express();

// Constants
const PORT = process.env.PORT || 3001;
const URL = process.env.CLIENT_URL;

// Middleware
app.use(
  cors({
    origin: URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/api/uploads", fileRoutes);
app.use("/api/password", resetPasswordRoutes);
app.use("/clicks-data", saveClickData);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadPath));

// Start Server
async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL");

    await User.sync({ alter: true });
    await LevelHistory.sync({ alter: true });

    app.listen(PORT, () => console.log(`🚀 Server started on port: ${PORT}`));
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
  }
}

start();
