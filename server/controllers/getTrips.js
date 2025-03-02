import Trips from "../models/Trips.js"
import User from "../models/User.js"

// Get All Trips
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trips.find().sort('order_id')

        if (trips.length === 0) {
            return res.status(404).json({ message: "No trips found" })
        }

        res.json(trips)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

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

        console.log('affiliateId:', affiliateId)
        console.log('couponCode:', couponCode)

        const trips = await Trips.find({
            $or: [
                { affiliate_id: affiliateId },
                { coupon_code: couponCode }
            ]
        })

        console.log('Trips found:', trips.length)

        if (trips.length === 0) {
            return res.status(404).json({ message: "No tours found for this user" })
        }

        // Исключаем дубликаты
        const existingTrips = new Set(user.trips.map(trip => trip._id.toString()))
        const newTrips = trips.filter(trip => !existingTrips.has(trip._id.toString()))

        if (newTrips.length > 0) {
            await User.findByIdAndUpdate(req.userId, {
                $addToSet: { trips: { $each: newTrips } },
            })
        }

        res.json(trips);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}