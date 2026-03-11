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
          tenantId,
        );

        const orderId = mappedData.orderId?.trim() || null;

        if (!orderId) {
          results.errors.push({
            trip: rawTrip,
            error: "orderId is required",
          });
          continue;
        }

        // Нормализуем дату для поиска (начало дня)
        const bookingDate = mappedData.bookingDate;
        const normalizedBookingDate = bookingDate
          ? new Date(bookingDate)
          : null;
        if (normalizedBookingDate) {
          normalizedBookingDate.setHours(0, 0, 0, 0);
        }

        // Ищем дубликат только по orderId
        const duplicate = await prisma.trips.findFirst({
          where: {
            tenantId: tenantId,
            orderId: orderId,
          },
        });

        // Валидация orderStatus
        const validStatuses = [
          "PENDING",
          "APPROVED",
          "CONFIRMED",
          "COMPLETED",
          "ONLINE_PAID",
          "DEPOSIT_PAID",
          "DEPARTED",
          "REJECTED",
          "CANCELLED",
          "WAIT_FOR_APPROVAL",
          "RECEIPT_SUBMITTED",
        ];
        const orderStatus = validStatuses.includes(mappedData.orderStatus)
          ? mappedData.orderStatus
          : "PENDING";

        // Нормализуем travelDate
        let normalizedTravelDate = mappedData.travelDate;
        if (normalizedTravelDate && normalizedTravelDate instanceof Date) {
          normalizedTravelDate.setHours(0, 0, 0, 0);
        }

        let affiliateIdToUse = mappedData.affiliateId?.trim() || null;
        if (affiliateIdToUse) {
          const profileInTenant = await prisma.partnerProfile.findFirst({
            where: {
              affiliateId: affiliateIdToUse,
              membership: { tenantId: tenantId },
            },
          });
          if (!profileInTenant) {
            affiliateIdToUse = null;
          }
        }

        // Подготавливаем данные для сохранения
        const tripData = {
          tenantId: tenantId,
          orderId: orderId,
          customerFirstName: mappedData.customerFirstName?.trim(),
          customerLastName: mappedData.customerLastName?.trim(),
          customerEmail: mappedData.customerEmail?.trim().toLowerCase(),
          bookingDate: normalizedBookingDate,
          travelDate: normalizedTravelDate || null,
          travellerAmount: mappedData.travellerAmount || 1,
          totalPrice: mappedData.totalPrice || 0,
          currency: mappedData.currency || "EUR",
          orderStatus: orderStatus,
          affiliateId: affiliateIdToUse,
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
