import prisma from "../prisma/client.js";

export const getUserClicks = async (req, res) => {
  try {
    // req.user.id это Identity.id (строка)
    const identityId = req.user?.id;
    const tenantId = req.user?.tenantId;

    if (!identityId || !tenantId) {
      return res
        .status(400)
        .json({ message: "Missing identity or tenant in request" });
    }

    // Получаем Identity
    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: { email: true, firstName: true, lastName: true },
    });

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    // Находим или создаем Membership
    let membership = await prisma.membership.findUnique({
      where: {
        identityId_tenantId: {
          identityId: identityId,
          tenantId: tenantId,
        },
      },
      include: {
        profile: true,
      },
    });

    // Если Membership не существует - создаем его с ролью PARTNER
    if (!membership) {
      membership = await prisma.membership.create({
        data: {
          identityId: identityId,
          tenantId: tenantId,
          role: "PARTNER",
        },
        include: {
          profile: true,
        },
      });
    }

    // Находим или создаем PartnerProfile
    let profile = membership.profile;
    if (!profile) {
      const affiliateId = `${(
        identity.firstName || "user"
      ).toLowerCase()}_${Math.floor(Math.random() * 90000 + 10000)}`;

      profile = await prisma.partnerProfile.create({
        data: {
          membershipId: membership.id,
          affiliateId: affiliateId,
          level: "BRONZE",
        },
      });
    }

    const clicks = await prisma.clicksData.findMany({
      where: { referralProfileId: profile.id }, // используем PartnerProfile.id
    });

    // Конвертируем BigInt в строки для JSON сериализации
    const serializedClicks = clicks.map((click) => ({
      ...click,
      id: click.id.toString(),
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
