import { Router } from "express";

import { getAllUsers } from "../controllers/getUsers.js";
import { getUserById } from "../controllers/admin/getUserById.js";
import { checkAuth, checkRole } from "../middleware/checkAuth.js";
import { resolveTenantFromHeader } from "../middleware/resolveTenantFromHeader.js";
import { getTripsByUserId } from "../controllers/admin/getTrips.js";
// import { updateUserAvatar } from "../controllers/userController.js";

const router = new Router();

// Все роуты требуют аутентификации, проверки роли и резолвят tenant из заголовка
router.use(checkAuth);
router.use(resolveTenantFromHeader);

// http://localhost:3002/api/users
router.get("/get-users", checkRole(["ADMIN"]), getAllUsers); // Все пользователи
router.get("/get-user/:id", checkRole(["ADMIN"]), getUserById); // Один пользователь
router.get("/:id/trips", checkRole(["ADMIN"]), getTripsByUserId);

export default router;
