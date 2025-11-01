import prisma from "../../prisma/client.js";

export const getUserById = async (req, res) => {
  try {
    const identityId = req.params.id; // Теперь это Identity.id (строка)
    const tenantId = req.user?.tenantId;

    if (!identityId) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Получаем Identity
    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!identity) {
      return res.status(404).json({ message: "User not found" });
    }

    // Получаем Membership для текущего tenant
    const membership = await prisma.membership.findUnique({
      where: {
        identityId_tenantId: {
          identityId: identityId,
          tenantId: tenantId,
        },
      },
      include: {
        profile: {
          include: {
            levelHistory: {
              orderBy: { changedAt: "asc" },
            },
            clicksData: true,
          },
        },
      },
    });

    if (!membership) {
      return res
        .status(404)
        .json({ message: "User membership not found in this tenant" });
    }

    const profile = membership.profile;

    // Получаем trips по affiliateId из PartnerProfile
    let affiliateTrips = [];
    if (profile?.affiliateId) {
      affiliateTrips = await prisma.trips.findMany({
        where: { affiliateId: profile.affiliateId },
      });
    }

    const userData = {
      id: identity.id,
      email: identity.email,
      firstName: identity.firstName || "",
      lastName: identity.lastName || "",
      avatarUrl: identity.avatarUrl,
      role: membership.role,
      phone: profile?.phone || null,
      emailVerified: true, // Identity всегда верифицирован
      couponCode: profile?.couponCode || null,
      affiliateId: profile?.affiliateId || null,
      level: profile?.level || "BRONZE",
      levelChangedAt: profile?.levelChangedAt || null,
      bookedTripsCount: profile?.bookedTripsCount || 0,
      currentYearTravellers: profile?.currentYearTravellers || 0,
      numberOfTravellers: profile?.numberOfTravellers || 0,
      earnings: profile?.earnings || 0,
      canceledEarnings: profile?.canceledEarnings || 0,
      totalCommission: profile?.totalCommission || 0,
      createdAt: identity.createdAt,
      updatedAt: profile?.updatedAt || identity.updatedAt,
    };

    res.json({
      user: userData,
      levelHistory: profile?.levelHistory || [],
      clicksData: profile?.clicksData || [],
      affiliateTrips: affiliateTrips.map((trip) => ({
        ...trip,
        id: trip.id.toString(), // Конвертируем BigInt в строку
      })),
    });
  } catch (error) {
    console.error("Error loading user:", error);
    res.status(500).json({ message: "Error loading data" });
  }
};
