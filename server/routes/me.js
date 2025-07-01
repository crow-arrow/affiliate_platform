import express from "express";
import multer from "../middleware/file.js";

import { checkAuth } from "../middleware/checkAuth.js";
import { getUserTrips } from "../controllers/me/getTrips.js";
import { getUserClicks } from "../controllers/getClicks.js";
import { uploadAvatar } from "../controllers/uploadFiles.js";

const router = express.Router();

// http://localhost:3002/api/me/trips for Users
router.get("/trips", checkAuth, getUserTrips);
// http://localhost:3002/api/me/clicks for Clicks analytic
router.get("/clicks", checkAuth, getUserClicks);

// http://localhost:3002/api/me/edit-profile for Profile settings
router.get("/edit-profile", checkAuth);
// router.post("/upload-avatar", upload.single("avatar"), updateUserAvatar); // Маршрут для загрузки аватара
router.patch(
  "/upload-avatar",
  checkAuth,
  multer.single("avatar"),
  uploadAvatar
);

export default router;
