import User from "../models/User.js";
import Trips from "../models/Trips.js";
import { Op } from "sequelize";

// Загрузка аватара
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
        await user.save();

        return {
          ...user.toJSON(),
          booked_trips_count: bookedTripsCount,
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
    const user = await User.findByPk(req.userId);

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

    // Функция для расчёта комиссии
    const getCommission = (level, totalPrice) => {
      const commissionRates = {
        Bronze: 0.07, // 7%
        Silver: 0.1, // 10%
        Gold: 0.12, // 12%
      };
      return (totalPrice * (commissionRates[level] || 0)).toFixed(2);
    };

    // Добавляем комиссию к каждому туру и обновляем заработанную комиссию пользователя
    let totalEarnedCommission = 0;

    const tripsWithCommission = trips.map((trip) => {
      const commission = getCommission(level, trip.total_price);
      totalEarnedCommission += parseFloat(commission); // Добавляем к общей комиссии пользователя

      return {
        ...trip.toJSON(),
        commission: commission,
      };
    });

    // Обновляем заработанную комиссию пользователя в базе данных
    user.earned_commission = totalEarnedCommission;
    await user.save();

    res.json({
      trips: tripsWithCommission,
      earned_commission: totalEarnedCommission, // Возвращаем общую комиссию пользователя
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
