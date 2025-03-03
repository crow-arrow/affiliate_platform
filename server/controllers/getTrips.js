import Trips from "../models/Trips.js"
import User from "../models/User.js"
import { Op } from "sequelize";

// Get All Trips
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trips.findAll({
            order: [['id', 'ASC']]
        });

        if (trips.length === 0) {
            return res.status(404).json({ message: "No trips found" });
        }

        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User Trips
export const getUserTrips = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { affiliate_id, coupon_code } = user;

        const filterCriteria = {
            where: {
                [Op.or]: []
            }
        };

        if (affiliate_id !== null) {
            filterCriteria.where[Op.or].push({ affiliate_id: affiliate_id });
        }

        if (coupon_code !== null) {
            filterCriteria.where[Op.or].push({ coupon_code: coupon_code });
        }

        // Если оба значения равны NULL, фильтрация будет пустой, и вернутся все туры.
        if (filterCriteria.where[Op.or].length === 0) {
            return res.status(400).json({ message: "User has no valid affiliate_id or coupon_code" });
        }

        const trips = await Trips.findAll(filterCriteria);

        if (trips.length === 0) {
            return res.status(404).json({ message: "No tours found for this user" });
        }

        const bookedTripsCount = trips.length;

        await User.update(
            { booked_trips_count: bookedTripsCount },
            { where: { id: req.userId } }
        );
        
        res.json({
            bookedTripsCount,
            trips
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};