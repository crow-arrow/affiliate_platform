// Get User Trips
import prisma from "../../prisma/client.js";
import { getCommission } from "../../utils/commissionCalculate.js";
import { updateUserLevel } from "../../utils/updateUserLevel.js";

export const getUserTrips = async (req, res) => {
  try {
    // req.user.id это Identity.id (строка)
    const identityId = req.user.id;
    const tenantId = req.user.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Получаем Identity
    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: { email: true, firstName: true, lastName: true },
    });

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    // Находим или создаем Membership
    let membership = await prisma.membership.findUnique({
      where: {
        identityId_tenantId: {
          identityId: identityId,
          tenantId: tenantId,
        },
      },
      include: {
        profile: {
          include: {
            levelHistory: {
              orderBy: { changedAt: "asc" },
            },
          },
        },
      },
    });

    // Если Membership не существует - создаем его с ролью PARTNER
    if (!membership) {
      membership = await prisma.membership.create({
        data: {
          identityId: identityId,
          tenantId: tenantId,
          role: "PARTNER",
        },
        include: {
          profile: {
            include: {
              levelHistory: {
                orderBy: { changedAt: "asc" },
              },
            },
          },
        },
      });
    }

    // Находим или создаем PartnerProfile
    let profile = membership.profile;
    if (!profile) {
      const affiliateId = `${(
        identity.firstName || "user"
      ).toLowerCase()}_${Math.floor(Math.random() * 90000 + 10000)}`;

      profile = await prisma.partnerProfile.create({
        data: {
          membershipId: membership.id,
          affiliateId: affiliateId,
          level: "BRONZE",
        },
        include: {
          levelHistory: {
            orderBy: { changedAt: "asc" },
          },
        },
      });
    }

    const { affiliateId, couponCode, level } = profile;

    // Проверяем, что профиль принадлежит текущему тенанту
    // Профиль уже загружен с membership, поэтому membership.tenantId должен совпадать
    if (membership.tenantId !== tenantId) {
      return res
        .status(403)
        .json({ message: "Profile does not belong to this tenant" });
    }

    const whereConditions = [];

    if (affiliateId !== null) {
      whereConditions.push({ affiliateId: affiliateId });
    }

    if (couponCode !== null) {
      whereConditions.push({ couponCode: couponCode });
    }

    if (whereConditions.length === 0) {
      return res
        .status(400)
        .json({ message: "User has no valid affiliateId or couponCode" });
    }

    // Фильтруем туры по affiliateId/couponCode текущего пользователя
    // И проверяем, что они принадлежат текущему тенанту
    // Если туры с tenantId не найдены, ищем туры с tenantId: null (для обратной совместимости)
    let trips = await prisma.trips.findMany({
      where: {
        AND: [
          {
            OR: whereConditions,
          },
          {
            tenantId: tenantId,
          },
        ],
      },
    });

    // Если не найдено туров с tenantId, ищем туры с tenantId: null (для обратной совместимости)
    if (trips.length === 0) {
      trips = await prisma.trips.findMany({
        where: {
          OR: whereConditions,
        },
      });
    }

    // Используем PartnerProfile для updateUserLevel
    const profileForLevelUpdate = {
      level: profile.level,
      levelHistory: profile.levelHistory || [],
    };

    const {
      newLevel,
      currentYearTravellers,
      lastYearTravellers,
      currentYearDepartedTrips,
      lastYearDepartedTrips,
    } = updateUserLevel(profileForLevelUpdate, trips);

    // Обновляем уровень, если он изменился
    if (newLevel !== profile.level) {
      await prisma.partnerProfile.update({
        where: { id: profile.id },
        data: {
          level: newLevel,
          levelChangedAt: new Date(),
        },
      });

      const newHistoryEntry = await prisma.levelHistory.create({
        data: {
          profileId: profile.id,
          level: newLevel,
          changedAt: new Date(),
        },
      });

      // Обновляем profile для использования в дальнейшем коде
      profile.level = newLevel;
      profile.levelHistory = [...(profile.levelHistory || []), newHistoryEntry];
    }

    // Перезагружаем profile с актуальной историей уровней
    const profileWithHistory = await prisma.partnerProfile.findUnique({
      where: { id: profile.id },
      include: {
        levelHistory: {
          orderBy: { changedAt: "asc" },
        },
      },
    });

    const levelHistorySorted = [
      ...(profileWithHistory?.levelHistory || []),
    ].sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));

    // Добавляем комиссию к каждому туру и обновляем заработанную комиссию пользователя
    let totalEarnedCommission = 0;
    const now = new Date();

    const tripsWithCommission = trips.map((trip) => {
      const travelDate = new Date(trip.travelDate);
      const isPast = travelDate <= now;
      const isCancelled =
        trip.orderStatus === "REJECTED" || trip.orderStatus === "CANCEL";

      // Найти уровень, который действовал на момент travelDate
      let applicableLevel = "BRONZE";

      for (const history of levelHistorySorted) {
        if (new Date(history.changedAt) <= travelDate) {
          applicableLevel = history.level;
        } else {
          break;
        }
      }

      const commission = getCommission(applicableLevel, trip.totalPrice);
      if (trip.orderStatus !== "REJECTED" && trip.orderStatus !== "CANCEL") {
        totalEarnedCommission += commission;
      }

      return {
        id: trip.id.toString(), // Конвертируем BigInt в строку
        travellerAmount: trip.travellerAmount,
        bookingDate: trip.bookingDate?.toISOString() || null,
        travelDate: trip.travelDate?.toISOString() || null,
        orderStatus: trip.orderStatus,
        totalPrice: trip.totalPrice?.toString() || "0",
        currency: trip.currency,
        couponCode: trip.couponCode,
        affiliateId: trip.affiliateId,
        commission: commission,
        levelUsed: applicableLevel,
        isCompleted: isPast && !isCancelled,
        isCanceled: isCancelled,
        createdAt: trip.createdAt?.toISOString() || null,
        updatedAt: trip.updatedAt?.toISOString() || null,
      };
    });

    const earnedFromDeparted = tripsWithCommission.reduce((sum, trip) => {
      return trip.isCompleted ? sum + (trip.commission || 0) : sum;
    }, 0);

    const canceledEarnings = tripsWithCommission.reduce((sum, trip) => {
      return trip.isCanceled ? sum + (trip.commission || 0) : sum;
    }, 0);

    const departedTrips = tripsWithCommission.filter(
      (trip) => trip.isCompleted
    );

    const travellerAmount = departedTrips.reduce((sum, trip) => {
      return sum + Number(trip.travellerAmount || 0);
    }, 0);

    // Подсчитываем общее количество забронированных туров
    const bookedTripsCount = trips.filter(
      (trip) => trip.orderStatus !== "REJECTED" && trip.orderStatus !== "CANCEL"
    ).length;

    // Обновляем PartnerProfile в базе данных
    await prisma.partnerProfile.update({
      where: { id: profile.id },
      data: {
        numberOfTravellers: travellerAmount,
        currentYearTravellers: currentYearTravellers,
        earnings: earnedFromDeparted,
        canceledEarnings: canceledEarnings,
        totalCommission: totalEarnedCommission,
        bookedTripsCount: bookedTripsCount,
        level: newLevel, // Обновляем уровень, если он изменился
      },
    });

    res.json({
      trips: tripsWithCommission,
      number_of_travellers: travellerAmount,
      current_year_travellers: currentYearTravellers,
      earnings: earnedFromDeparted,
      canceled_earnings: canceledEarnings,
      total_commission: totalEarnedCommission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
