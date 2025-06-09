import { ClicksData, User } from "../models/models.js";

export const getUserClicks = async (req, res) => {
  try {
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
    res.json({ userId: user.id, clicks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
