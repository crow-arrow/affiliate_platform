import prisma from "../../prisma/client.js";

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
   * Преобразует входящие данные по маппингу
   */
  static async mapFields(incomingData, tenantId) {
    const mappingMap = await this.getMappings(tenantId);
    const mappedData = {};

    for (const [incomingKey, incomingValue] of Object.entries(incomingData)) {
      const targetField = mappingMap[incomingKey];
      if (targetField && incomingValue !== null && incomingValue !== undefined) {
        // Преобразуем значение в зависимости от типа поля
        mappedData[targetField] = this.transformValue(targetField, incomingValue);
      }
      // Если поле не в маппинге - игнорируем
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

