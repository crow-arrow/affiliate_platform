import express from "express";
import { checkAuth } from "../../middleware/checkAuth.js";
import { resolveTenantFromHeader } from "../../middleware/resolveTenantFromHeader.js";
import {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} from "../../controllers/admin/apiKeys.js";
import {
  getFieldMappings,
  getAvailableFields,
  createFieldMapping,
  updateFieldMapping,
  deleteFieldMapping,
} from "../../controllers/admin/fieldMappings.js";

const router = express.Router();

// Все роуты требуют аутентификации и резолвят tenant из заголовка
router.use(checkAuth);
router.use(resolveTenantFromHeader);

// API Keys
router.get("/api-keys", getApiKeys);
router.post("/api-keys", createApiKey);
router.put("/api-keys/:id", updateApiKey);
router.delete("/api-keys/:id", deleteApiKey);

// Field Mappings
router.get("/field-mappings", getFieldMappings);
router.get("/field-mappings/fields", getAvailableFields);
router.post("/field-mappings", createFieldMapping);
router.put("/field-mappings/:id", updateFieldMapping);
router.delete("/field-mappings/:id", deleteFieldMapping);

export default router;
