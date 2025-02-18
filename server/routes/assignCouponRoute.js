import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Назначение купона пользователю
router.post("/", async (req, res) => {
    try {
        const { userId, coupon } = req.body

        // Проверяем, указан ли userId и coupon
        if (!userId || !coupon) {
            return res.status(400).json({ message: "User ID and coupon are required" })
        }

        // Ищем пользователя в базе данных
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Проверяем, есть ли у пользователя уже назначенный купон
        if (user.couponCode) {
            return res.status(409).json({ message: "User already has a coupon code" })
        }

        // Назначаем купон пользователю
        user.couponCode = coupon
        await user.save()

        res.status(200).json({ message: "Coupon assigned successfully" })
    } catch (error) {
        console.error("Error assigning coupon:", error)
        res.status(500).json({ message: "Server error" })
    }
})

export default router;