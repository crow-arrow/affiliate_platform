import prisma from "../prisma/client.js";

export const getAllUsers = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Получаем все Membership для текущего tenant с их Profile и Identity
    const memberships = await prisma.membership.findMany({
      where: { tenantId: tenantId },
      include: {
        identity: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        profile: {
          include: {
            levelHistory: true,
          },
        },
      },
    });

    if (!memberships || memberships.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    const usersWithTripsCount = await Promise.all(
      memberships.map(async (membership) => {
        const identity = membership.identity;
        const profile = membership.profile;

        // Если нет профиля, создаем минимальный объект
        if (!profile) {
          return {
            id: identity.id,
            email: identity.email,
            firstName: identity.firstName || "",
            lastName: identity.lastName || "",
            avatarUrl: identity.avatarUrl,
            role: membership.role,
            level: "BRONZE",
            affiliateId: null,
            couponCode: null,
            bookedTripsCount: 0,
            numberOfTravellers: 0,
            earnings: 0,
            canceledEarnings: 0,
            totalCommission: 0,
            createdAt: identity.createdAt,
            updatedAt: identity.updatedAt,
          };
        }

        if (profile.affiliateId === null && profile.couponCode === null) {
          return {
            id: identity.id,
            email: identity.email,
            firstName: identity.firstName || "",
            lastName: identity.lastName || "",
            avatarUrl: identity.avatarUrl,
            role: membership.role,
            level: profile.level,
            affiliateId: profile.affiliateId,
            couponCode: profile.couponCode,
            bookedTripsCount: 0,
            numberOfTravellers: profile.numberOfTravellers || 0,
            earnings: profile.earnings || 0,
            canceledEarnings: profile.canceledEarnings || 0,
            totalCommission: profile.totalCommission || 0,
            createdAt: identity.createdAt,
            updatedAt: profile.updatedAt,
          };
        }

        const whereConditions = [];

        if (profile.affiliateId !== null) {
          whereConditions.push({ affiliateId: profile.affiliateId });
        }

        if (profile.couponCode !== null) {
          whereConditions.push({ couponCode: profile.couponCode });
        }

        if (whereConditions.length === 0) {
          return {
            id: identity.id,
            email: identity.email,
            firstName: identity.firstName || "",
            lastName: identity.lastName || "",
            avatarUrl: identity.avatarUrl,
            role: membership.role,
            level: profile.level,
            affiliateId: profile.affiliateId,
            couponCode: profile.couponCode,
            bookedTripsCount: 0,
            numberOfTravellers: profile.numberOfTravellers || 0,
            earnings: profile.earnings || 0,
            canceledEarnings: profile.canceledEarnings || 0,
            totalCommission: profile.totalCommission || 0,
            createdAt: identity.createdAt,
            updatedAt: profile.updatedAt,
          };
        }

        const trips = await prisma.trips.findMany({
          where: {
            OR: whereConditions,
          },
        });

        const bookedTripsCount = trips.length;

        const departedTrips = trips.filter(
          (trip) => trip.orderStatus === "COMPLETED"
        );

        const travellerAmount = departedTrips.reduce((sum, trip) => {
          return sum + Number(trip.travellerAmount || 0);
        }, 0);

        // Обновляем PartnerProfile в базе данных
        await prisma.partnerProfile.update({
          where: { id: profile.id },
          data: {
            numberOfTravellers: travellerAmount,
          },
        });

        return {
          id: identity.id,
          email: identity.email,
          firstName: identity.firstName || "",
          lastName: identity.lastName || "",
          avatarUrl: identity.avatarUrl,
          role: membership.role,
          level: profile.level,
          affiliateId: profile.affiliateId,
          couponCode: profile.couponCode,
          bookedTripsCount: bookedTripsCount,
          numberOfTravellers: travellerAmount,
          earnings: profile.earnings || 0,
          canceledEarnings: profile.canceledEarnings || 0,
          totalCommission: profile.totalCommission || 0,
          createdAt: identity.createdAt,
          updatedAt: profile.updatedAt,
        };
      })
    );

    res.json(usersWithTripsCount);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error loading users", error: error.message });
  }
};
