import { ClicksData, User } from "../models/models.js";

export const getUserClicks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Missing user in request" });
    }

    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: ClicksData,
          as: "clicksData",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const clicks = await ClicksData.findAll({
      where: {
        referral_user_id: user.id,
      },
    });
    res.json({ success: true, userId: user.id, clicks });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
