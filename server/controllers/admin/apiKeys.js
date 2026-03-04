import prisma from "../../prisma/client.js";
import crypto from "crypto";

/**
 * Генерирует новый API ключ
 */
function generateApiKey() {
  return `ak_${crypto.randomBytes(32).toString("hex")}`;
}

/**
 * GET /api/admin/api-keys
 * Получить все API ключи тенанта
 */
export const getApiKeys = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const apiKeys = await prisma.tenantApiKey.findMany({
      where: {
        tenantId: tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ apiKeys });
  } catch (error) {
    console.error("Get API keys error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * POST /api/admin/api-keys
 * Создать новый API ключ
 */
export const createApiKey = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const { name } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const apiKey = generateApiKey();

    const apiKeyRecord = await prisma.tenantApiKey.create({
      data: {
        tenantId: tenantId,
        apiKey: apiKey,
        name: name || "API Key",
        isActive: true,
      },
    });

    res.status(201).json({
      message: "API key created successfully",
      apiKey: apiKeyRecord,
    });
  } catch (error) {
    console.error("Create API key error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * PUT /api/admin/api-keys/:id
 * Обновить API ключ (активация/деактивация, имя)
 */
export const updateApiKey = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { name, isActive } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Проверяем, что ключ принадлежит текущему тенанту
    const existingKey = await prisma.tenantApiKey.findUnique({
      where: { id },
    });

    if (!existingKey || existingKey.tenantId !== tenantId) {
      return res.status(404).json({ message: "API key not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedKey = await prisma.tenantApiKey.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "API key updated successfully",
      apiKey: updatedKey,
    });
  } catch (error) {
    console.error("Update API key error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * DELETE /api/admin/api-keys/:id
 * Удалить API ключ
 */
export const deleteApiKey = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Проверяем, что ключ принадлежит текущему тенанту
    const existingKey = await prisma.tenantApiKey.findUnique({
      where: { id },
    });

    if (!existingKey || existingKey.tenantId !== tenantId) {
      return res.status(404).json({ message: "API key not found" });
    }

    await prisma.tenantApiKey.delete({
      where: { id },
    });

    res.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Delete API key error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
