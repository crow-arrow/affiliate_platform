import { User, Trips } from "../models/models.js";
import { Op } from "sequelize";

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
