// Get User Trips
import prisma from "../../prisma/client.js";
import { getCommission } from "../../utils/commissionCalculate.js";
import { updateUserLevel } from "../../utils/updateUserLevel.js";

export const getUserTrips = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        levelHistory: {
          orderBy: { changed_at: "asc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { affiliate_id, coupon_code, level } = user;

    const whereConditions = [];

    if (affiliate_id !== null) {
      whereConditions.push({ affiliate_id: affiliate_id });
    }

    if (coupon_code !== null) {
      whereConditions.push({ coupon_code: coupon_code });
    }

    if (whereConditions.length === 0) {
      return res
        .status(400)
        .json({ message: "User has no valid affiliate_id or coupon_code" });
    }

    const trips = await prisma.trips.findMany({
      where: {
        OR: whereConditions,
      },
    });

    const {
      newLevel,
      currentYearTravellers,
      lastYearTravellers,
      currentYearDepartedTrips,
      lastYearDepartedTrips,
    } = updateUserLevel(user, trips);

    if (newLevel !== user.level) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          level: newLevel,
          levelChangedAt: new Date(),
        },
      });

      await prisma.levelHistory.create({
        data: {
          user_id: user.id,
          level: newLevel,
          changed_at: new Date(),
        },
      });
    }

    const levelHistorySorted = [...(user.levelHistory || [])].sort(
      (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
    );

    // Добавляем комиссию к каждому туру и обновляем заработанную комиссию пользователя
    let totalEarnedCommission = 0;
    const now = new Date();

    const tripsWithCommission = trips.map((trip) => {
      const travelDate = new Date(trip.travel_date);
      const isPast = travelDate <= now;
      const isCancelled =
        trip.order_status === "REJECTED" || trip.order_status === "CANCEL";

      // Найти уровень, который действовал на момент travelDate
      let applicableLevel = "BRONZE";

      for (const history of levelHistorySorted) {
        if (new Date(history.changed_at) <= travelDate) {
          applicableLevel = history.level;
        } else {
          break;
        }
      }

      const commission = getCommission(applicableLevel, trip.total_price);
      if (trip.order_status !== "REJECTED" && trip.order_status !== "CANCEL") {
        totalEarnedCommission += commission;
      }

      return {
        ...trip,
        commission: commission,
        level_used: applicableLevel,
        isCompleted: isPast && !isCancelled,
        isCanceled: isCancelled,
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
      return sum + Number(trip.traveller_amount || 0);
    }, 0);

    // Обновляем пользователя в базе данных
    await prisma.user.update({
      where: { id: user.id },
      data: {
        number_of_travellers: travellerAmount,
        current_year_travellers: currentYearTravellers,
        earnings: earnedFromDeparted,
        canceled_earnings: canceledEarnings,
        total_commission: totalEarnedCommission,
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
