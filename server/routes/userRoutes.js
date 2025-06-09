import { Router } from "express";

import { getAllUsers, getUserTrips } from "../controllers/getUsers.js";
import { getUserClicks } from "../controllers/getClicks.js";
import { getUserById } from "../controllers/getUserById.js";
import { checkAuth } from "../utils/checkAuth.js";
// import { updateUserAvatar } from "../controllers/userController.js";

const router = new Router();

// http://localhost:3002/api/users
router.get("/get-users", getAllUsers); // Все пользователи
router.get("/get-user/:id", checkAuth, getUserById); // Один пользователь
router.get("/:id/trips", checkAuth, getUserTrips);
console.log("Defining route /:id/clicks");
router.get("/:id/clicks", checkAuth, getUserClicks);
router.get("/:id/edit-profile", checkAuth, getUserTrips);

export default router;
