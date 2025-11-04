import prisma from "../../prisma/client.js";
import { FieldMappingService } from "./fieldMapping.js";

/**
 * Прием туров от внешних систем через API
 * POST /api/integration/trips
 */
export const receiveTrips = async (req, res) => {
  try {
    const { tenantId } = req;
    const trips = Array.isArray(req.body) ? req.body : [req.body];

    if (trips.length === 0) {
      return res.status(400).json({ message: "No trips provided" });
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [],
    };

    // Получаем маппинги для тенанта
    const mappingMap = await FieldMappingService.getMappings(tenantId);

    for (const rawTrip of trips) {
      try {
        // Преобразуем входящие данные по маппингу
        const mappedData = await FieldMappingService.mapFields(
          rawTrip,
          tenantId
        );

        // Проверяем обязательные поля для определения дубликата
        const customerFirstName = mappedData.customerFirstName;
        const customerLastName = mappedData.customerLastName;
        const customerEmail = mappedData.customerEmail;
        const bookingDate = mappedData.bookingDate;

        if (
          !customerFirstName ||
          !customerLastName ||
          !customerEmail ||
          !bookingDate
        ) {
          results.errors.push({
            trip: rawTrip,
            error:
              "Missing required fields: customerFirstName, customerLastName, customerEmail, bookingDate",
          });
          continue;
        }

        // Нормализуем дату для поиска (начало дня)
        const normalizedBookingDate = bookingDate
          ? new Date(bookingDate)
          : null;
        if (normalizedBookingDate) {
          normalizedBookingDate.setHours(0, 0, 0, 0);
        }

        // Ищем дубликат по customerFirstName + customerLastName + customerEmail + bookingDate
        const duplicate = await prisma.trips.findFirst({
          where: {
            tenantId: tenantId,
            customerFirstName: customerFirstName?.trim(),
            customerLastName: customerLastName?.trim(),
            customerEmail: customerEmail?.trim().toLowerCase(),
            bookingDate: normalizedBookingDate,
          },
        });

        // Валидация orderStatus
        const validStatuses = [
          "APPROVED",
          "PENDING",
          "CONFIRMED",
          "CANCEL",
          "COMPLETED",
          "WAIT_FOR_APPROVAL",
          "REJECTED",
          "DEPOSIT_PAID",
        ];
        const orderStatus = validStatuses.includes(mappedData.orderStatus)
          ? mappedData.orderStatus
          : "PENDING";

        // Нормализуем travelDate
        let normalizedTravelDate = mappedData.travelDate;
        if (normalizedTravelDate && normalizedTravelDate instanceof Date) {
          normalizedTravelDate.setHours(0, 0, 0, 0);
        }

        // Подготавливаем данные для сохранения
        const tripData = {
          tenantId: tenantId,
          customerFirstName: customerFirstName?.trim(),
          customerLastName: customerLastName?.trim(),
          customerEmail: customerEmail?.trim().toLowerCase(),
          bookingDate: normalizedBookingDate,
          travelDate: normalizedTravelDate || null,
          travellerAmount: mappedData.travellerAmount || 1,
          totalPrice: mappedData.totalPrice || 0,
          currency: mappedData.currency || "EUR",
          orderStatus: orderStatus,
          affiliateId: mappedData.affiliateId?.trim() || null,
          couponCode: mappedData.couponCode?.trim() || null,
        };

        if (duplicate) {
          // Обновляем существующий тур
          await prisma.trips.update({
            where: { id: duplicate.id },
            data: tripData,
          });
          results.updated++;
        } else {
          // Создаем новый тур
          await prisma.trips.create({
            data: tripData,
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          trip: rawTrip,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Trips processed successfully",
      results,
    });
  } catch (error) {
    console.error("Receive trips error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
