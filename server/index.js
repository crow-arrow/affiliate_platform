import "./loadEnv.js";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./prisma/client.js";

// Глобальный обработчик для BigInt сериализации
BigInt.prototype.toJSON = function () {
  return this.toString();
};

import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import resetPasswordRoutes from "./routes/reserPassword.js";
import userRoutes from "./routes/userRoutes.js";
import tripsRoutes from "./routes/tripsRoutes.js";
import redirectRoutes from "./routes/redirect.js";
import conversionRoutes from "./routes/conversion.js";
import levelSettingsRoutes from "./routes/admin/levelSettings.js";
import integrationAdminRoutes from "./routes/admin/integration.js";
import tenantRoutes from "./routes/tenant.js";
import integrationRoutes from "./routes/integration.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;
const URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Tenant-Slug",
      "X-API-Key",
    ],
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/api/password", resetPasswordRoutes);
app.use("/r", redirectRoutes);
app.use("/api/prisma", conversionRoutes);
app.use("/api/admin/level-settings", levelSettingsRoutes);
app.use("/api/admin/integration", integrationAdminRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/integration", integrationRoutes);

// Static upload folder
const uploadPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadPath));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port: ${PORT}`);
});
