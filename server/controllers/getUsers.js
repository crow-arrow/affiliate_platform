import { User, LevelHistory, Trips } from "../models/models.js";
import { Op } from "sequelize";
import { getCommission } from "../utils/commissionCalculate.js";
import { updateUserLevel } from "../utils/updateUserLevel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    const usersWithTripsCount = await Promise.all(
      users.map(async (user) => {
        if (user.affiliate_id === null && user.coupon_code === null) {
          return {
            ...user.toJSON(),
            booked_trips_count: 0,
          };
        }

        const filterCriteria = {
          where: {
            [Op.or]: [],
          },
        };

        if (user.affiliate_id !== null) {
          filterCriteria.where[Op.or].push({ affiliate_id: user.affiliate_id });
        }

        if (user.coupon_code !== null) {
          filterCriteria.where[Op.or].push({ coupon_code: user.coupon_code });
        }

        if (filterCriteria.where[Op.or].length === 0) {
          return {
            ...user.toJSON(),
            booked_trips_count: 0,
          };
        }

        const trips = await Trips.findAll(filterCriteria);
        const bookedTripsCount = trips.length;
        user.booked_trips_count = bookedTripsCount;

        const departedTrips = trips.filter(
          (trip) => trip.order_status === "departed"
        );

        const travellerAmount = departedTrips.reduce((sum, trip) => {
          return sum + Number(trip.traveller_amount || 0);
        }, 0);
        user.number_of_travellers = travellerAmount;
        await user.save();

        return {
          ...user.toJSON(),
          booked_trips_count: bookedTripsCount,
          number_of_travellers: travellerAmount,
        };
      })
    );

    res.json(usersWithTripsCount);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error loading users", error: error.message });
  }
};
// Get User Trips
export const getUserTrips = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: LevelHistory,
          as: "levelHistory",
          separate: true,
          order: [["changed_at", "ASC"]],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { affiliate_id, coupon_code, level } = user;

    const filterCriteria = {
      where: {
        [Op.or]: [],
      },
    };

    if (affiliate_id !== null) {
      filterCriteria.where[Op.or].push({ affiliate_id: affiliate_id });
    }

    if (coupon_code !== null) {
      filterCriteria.where[Op.or].push({ coupon_code: coupon_code });
    }

    if (filterCriteria.where[Op.or].length === 0) {
      return res
        .status(400)
        .json({ message: "User has no valid affiliate_id or coupon_code" });
    }

    const trips = await Trips.findAll(filterCriteria);

    const {
      newLevel,
      currentYearTravellers,
      lastYearTravellers,
      currentYearDepartedTrips,
      lastYearDepartedTrips,
    } = updateUserLevel(user, trips);

    if (newLevel !== user.level) {
      user.level = newLevel;
      user.levelChangedAt = new Date();
      await user.save();

      await LevelHistory.create({
        user_id: user.id,
        level: newLevel,
        changed_at: user.levelChangedAt,
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
        trip.order_status === "rejected" || trip.order_status === "cancel";

      // Найти уровень, который действовал на момент travelDate
      let applicableLevel = "Bronze";

      for (const history of levelHistorySorted) {
        if (new Date(history.changed_at) <= travelDate) {
          applicableLevel = history.level;
        } else {
          break;
        }
      }

      const commission = getCommission(applicableLevel, trip.total_price);
      if (trip.order_status !== "rejected" && trip.order_status !== "cancel") {
        totalEarnedCommission += commission;
      }

      return {
        ...(typeof trip.toJSON === "function" ? trip.toJSON() : trip),
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

    user.number_of_travellers = travellerAmount;
    user.current_year_travellers = currentYearTravellers;
    user.earnings = earnedFromDeparted;
    user.canceled_earnings = canceledEarnings;
    user.total_commission = totalEarnedCommission;
    await user.save();

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
