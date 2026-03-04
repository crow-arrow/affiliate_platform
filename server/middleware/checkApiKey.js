import prisma from "../prisma/client.js";

/**
 * Middleware для проверки API ключа и определения тенанта
 */
export const checkApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"] || req.headers["authorization"]?.replace("Bearer ", "");

    if (!apiKey) {
      return res.status(401).json({ message: "API key is required" });
    }

    // Ищем активный API ключ
    const apiKeyRecord = await prisma.tenantApiKey.findUnique({
      where: {
        apiKey: apiKey,
        isActive: true,
      },
      include: {
        tenant: true,
      },
    });

    if (!apiKeyRecord) {
      return res.status(401).json({ message: "Invalid or inactive API key" });
    }

    // Добавляем tenantId в request для использования в контроллерах
    req.tenantId = apiKeyRecord.tenantId;
    req.tenant = apiKeyRecord.tenant;
    req.apiKey = apiKeyRecord;

    next();
  } catch (error) {
    console.error("API key check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

