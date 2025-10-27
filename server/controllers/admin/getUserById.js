import prisma from "../../prisma/client.js";

export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        emailVerified: true,
        coupon_code: true,
        affiliate_id: true,
        role: true,
        level: true,
        levelChangedAt: true,
        booked_trips_count: true,
        current_year_travellers: true,
        number_of_travellers: true,
        earnings: true,
        canceled_earnings: true,
        total_commission: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        levelHistory: true,
        clicksData: true,
        affiliateTrips: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      levelHistory: user.levelHistory,
      clicksData: user.clicksData,
      affiliateTrips: user.affiliateTrips,
    });
  } catch (error) {
    console.error("Error loading user:", error);
    res.status(500).json({ message: "Error loading data" });
  }
};
