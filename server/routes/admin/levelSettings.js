import express from "express";
import { checkAuth } from "../../middleware/checkAuth.js";
import { resolveTenantFromHeader } from "../../middleware/resolveTenantFromHeader.js";
import { getLevelSettings, updateLevelSettings, createLevel, deleteLevel } from "../../controllers/admin/levelSettings.js";

const router = express.Router();

// Все роуты требуют авторизации и резолвят tenant из заголовка
router.use(checkAuth);
router.use(resolveTenantFromHeader);

// Получить настройки уровней
router.get('/get', getLevelSettings);

// Обновить настройки уровней
router.put('/update', updateLevelSettings);

// Создать новый уровень
router.post('/levels', createLevel);

// Удалить уровень
router.delete('/levels/:id', deleteLevel);

export default router;
