import { Router } from "express";

import { getAllUsers } from "../controllers/getUsers.js";
import { getUserById } from "../controllers/admin/getUserById.js";
import { checkAuth, checkRole } from "../middleware/checkAuth.js";
import { getTripsByUserId } from "../controllers/admin/getTrips.js";
// import { updateUserAvatar } from "../controllers/userController.js";

const router = new Router();

// http://localhost:3002/api/users
router.get("/get-users", checkAuth, checkRole(["ADMIN"]), getAllUsers); // Все пользователи
router.get("/get-user/:id", checkAuth, checkRole(["ADMIN"]), getUserById); // Один пользователь
router.get("/:id/trips", checkAuth, checkRole(["ADMIN"]), getTripsByUserId);

export default router;
