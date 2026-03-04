import prisma from "../../prisma/client.js";

// Get All Trips для текущего тенанта
export const getAllTrips = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const trips = await prisma.trips.findMany({
      where: {
        tenantId: tenantId,
      },
      orderBy: { id: "asc" },
    });

    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found" });
    }

    // Конвертируем BigInt в строки для JSON сериализации
    const serializedTrips = trips.map((trip) => ({
      ...trip,
      id: trip.id.toString(),
    }));

    res.json(serializedTrips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTripsByUserId = async (req, res) => {
  try {
    const identityId = req.params.id; // Теперь это Identity.id (строка)
    const tenantId = req.user?.tenantId;

    if (!identityId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Получаем Membership и Profile
    const membership = await prisma.membership.findUnique({
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

    if (!membership || !membership.profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const profile = membership.profile;

    // Получаем trips по affiliateId из PartnerProfile и tenantId
    let trips = [];
    if (profile.affiliateId) {
      trips = await prisma.trips.findMany({
        where: {
          affiliateId: profile.affiliateId,
          tenantId: tenantId,
        },
      });
    }

    // Конвертируем BigInt в строки для JSON сериализации
    const serializedTrips = trips.map((trip) => ({
      ...trip,
      id: trip.id.toString(),
    }));

    res.json({ trips: serializedTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
