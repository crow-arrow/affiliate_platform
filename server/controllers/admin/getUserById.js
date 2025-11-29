import User from "../../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        { association: "levelHistory", as: "levelHistory" },
        { association: "clicksData", as: "clicksData" },
        { association: "affiliateTrips", as: "affiliateTrips" },
      ],
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
