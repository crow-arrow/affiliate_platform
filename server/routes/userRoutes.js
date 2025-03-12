import { Router } from "express";
import multer from "../middleware/file.js";

import {
  getAllUsers,
  getUserTrips,
  uploadAvatar,
} from "../controllers/getUsers.js";
import { getUserById } from "../controllers/getUserById.js";
import { checkAuth } from "../utils/checkAuth.js";
// import { updateUserAvatar } from "../controllers/userController.js";

const router = new Router();

// http://localhost:3002/api/users
router.get("/get-users", getAllUsers); // Все пользователи
router.get("/get-user/:id", checkAuth, getUserById); // Один пользователь
router.get("/get-trips", checkAuth, getUserTrips);
// router.post("/upload-avatar", upload.single("avatar"), updateUserAvatar); // Маршрут для загрузки аватара
router.patch("/avatar", multer.single("avatar"), uploadAvatar);

export default router;
