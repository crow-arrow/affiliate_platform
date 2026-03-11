import prisma from "../../prisma/client.js";

// Поля Trips (должен совпадать с TripField enum)
const KNOWN_FIELDS = [
  "orderId",
  "travelDate",
  "bookingDate",
  "customerFirstName",
  "customerLastName",
  "customerEmail",
  "affiliateId",
  "couponCode",
  "travellerAmount",
  "totalPrice",
  "orderStatus",
  "currency",
];

/**
 * snake_case → camelCase
 */
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Утилиты для маппинга полей входящих данных
 */
export class FieldMappingService {
  /**
   * Получает активные маппинги для тенанта
   */
  static async getMappings(tenantId) {
    const mappings = await prisma.tenantFieldMapping.findMany({
      where: {
        tenantId: tenantId,
        isActive: true,
      },
    });

    // Создаем мапу для быстрого поиска
    const mappingMap = {};
    mappings.forEach((m) => {
      mappingMap[m.incomingField] = m.targetField;
    });

    return mappingMap;
  }

  /**
   * Преобразует входящие данные по маппингу.
   * Приоритет: 1) маппинг из настроек, 2) авто snake_case→camelCase, 3) pass-through для точного совпадения.
   */
  static async mapFields(incomingData, tenantId) {
    const mappingMap = await this.getMappings(tenantId);
    const mappedData = {};

    for (const [incomingKey, incomingValue] of Object.entries(incomingData)) {
      if (incomingValue === null || incomingValue === undefined) continue;

      // 1. Маппинг из настроек (приоритет)
      let targetField = mappingMap[incomingKey];

      // 2. Авто snake_case → camelCase для известных полей
      if (!targetField) {
        const camelKey = snakeToCamel(incomingKey);
        if (KNOWN_FIELDS.includes(camelKey)) {
          targetField = camelKey;
        }
      }

      // 3. Pass-through: ключ уже совпадает с целевым полем
      if (!targetField && KNOWN_FIELDS.includes(incomingKey)) {
        targetField = incomingKey;
      }

      if (targetField) {
        mappedData[targetField] = this.transformValue(
          targetField,
          incomingValue,
        );
      }
    }

    return mappedData;
  }

  /**
   * Преобразует значение в зависимости от типа поля
   */
  static transformValue(targetField, value) {
    // Для дат - нормализуем до начала дня для сравнения
    if (targetField === "travelDate" || targetField === "bookingDate") {
      if (!value) return null;
      const date = new Date(value);
      if (isNaN(date.getTime())) return null;
      // Нормализуем до начала дня (убираем время)
      date.setHours(0, 0, 0, 0);
      return date;
    }

    // Для чисел
    if (targetField === "travellerAmount" || targetField === "totalPrice") {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }

    // Для строк - убираем лишние пробелы
    if (typeof value === "string") {
      return value.trim();
    }

    return value;
  }
}
