import prisma from "../prisma/client.js";

export const getUserClicks = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "Missing user in request" });
    }

    const clicks = await prisma.clicksData.findMany({
      where: { referral_user_id: userId },
    });

    // Конвертируем BigInt в строки для JSON сериализации
    const serializedClicks = clicks.map(click => ({
      ...click,
      id: click.id.toString()
    }));

    return res.json({ clicks: serializedClicks });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
