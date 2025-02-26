import Trips from "../models/Trips.js";
import User from "../models/User.js";

// Get All Trips
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trips.find().sort('order_id')
        if (!trips) {
            res.json({message: 'No trips found'})
        }
        res.json(trips)
    } catch (error) {
        res.json({message: 'Error get Trips'})
    }
}

// Get User Trips
export const getUserTrips = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const { affiliateId, couponCode } = user

        if (!affiliateId || !couponCode) {
            return res.status(400).json({ message: "No data available for filtering" })
        }

        const trips = await Trips.find({
            $or: [
                { affiliate_id: { $regex: new RegExp(`^${affiliateId}$`) } },
                { coupon_code: { $regex: new RegExp(`^${couponCode}$`) } }
            ]
        })

        if (trips.length === 0) {
            return res.status(404).json({ message: "No tours found for this user" });
        }

        await User.findByIdAndUpdate(req.userId, {
            $push: { trips: trips },
        });

        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}