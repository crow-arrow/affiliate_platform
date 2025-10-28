import prisma from "../../prisma/client.js";

// Get All Trips
export const getAllTrips = async (req, res) => {
  try {
    const trips = await prisma.trips.findMany({
      orderBy: { id: "asc" },
    });

    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found" });
    }

    // Конвертируем BigInt в строки для JSON сериализации
    const serializedTrips = trips.map(trip => ({
      ...trip,
      id: trip.id.toString()
    }));
    
    res.json(serializedTrips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTripsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        affiliateTrips: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trips = user.affiliateTrips;
    
    // Конвертируем BigInt в строки для JSON сериализации
    const serializedTrips = trips.map(trip => ({
      ...trip,
      id: trip.id.toString()
    }));
    
    res.json({ trips: serializedTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
