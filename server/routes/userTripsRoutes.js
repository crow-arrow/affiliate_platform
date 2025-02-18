import express from "express";
import Trips from "../models/Trips.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const trips = await Trips.find({ coupon_code: user.couponCode });

        res.status(200).json(trips);
    } catch (error) {
        console.error("Error fetching user trips:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;