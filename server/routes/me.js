import express from "express";
import multer from "../middleware/file.js";

import { checkAuth } from "../middleware/checkAuth.js";
import { resolveTenantFromHeader } from "../middleware/resolveTenantFromHeader.js";
import { getUserTrips } from "../controllers/me/getTrips.js";
import { getUserClicks } from "../controllers/getClicks.js";
import { updateUserProfile } from "../controllers/me/updateProfile.js";
import { uploadAvatar, deleteAvatar } from "../controllers/uploadFiles.js";
import { changePassword } from "../controllers/me/changePassword.js";
import { setPassword } from "../controllers/me/setPassword.js";

const router = express.Router();

// Все роуты требуют аутентификации и резолвят tenant из заголовка
router.use(checkAuth);
router.use(resolveTenantFromHeader);

// http://localhost:3002/api/me/trips for Users
router.get("/trips", getUserTrips);

// http://localhost:3002/api/me/clicks for Clicks analytic
router.get("/clicks", getUserClicks);

// http://localhost:3002/api/me/update-profile for Profile settings
router.patch("/update-profile", updateUserProfile);

// Change password for authenticated user
router.patch("/change-password", changePassword);

// Set password for OAuth users (no password yet)
router.patch("/set-password", setPassword);

// router.post("/upload-avatar", upload.single("avatar"), updateUserAvatar);
router.patch("/upload-avatar", multer.single("avatar"), uploadAvatar);
router.delete("/avatar", deleteAvatar);

export default router;
