import { Router } from "express";
import multer from "../middleware/file.js";

import { uploadAvatar } from "../controllers/uploadFiles.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// router.post("/upload-avatar", upload.single("avatar"), updateUserAvatar); // Маршрут для загрузки аватара
router.patch("/avatar", checkAuth, multer.single("avatar"), uploadAvatar);

export default router;
