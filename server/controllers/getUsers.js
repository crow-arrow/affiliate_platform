import prisma from "../prisma/client.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    const usersWithTripsCount = await Promise.all(
      users.map(async (user) => {
        if (user.affiliate_id === null && user.coupon_code === null) {
          return {
            ...user,
            booked_trips_count: 0,
          };
        }

        const whereConditions = [];

        if (user.affiliate_id !== null) {
          whereConditions.push({ affiliate_id: user.affiliate_id });
        }

        if (user.coupon_code !== null) {
          whereConditions.push({ coupon_code: user.coupon_code });
        }

        if (whereConditions.length === 0) {
          return {
            ...user,
            booked_trips_count: 0,
          };
        }

        const trips = await prisma.trips.findMany({
          where: {
            OR: whereConditions,
          },
        });

        const bookedTripsCount = trips.length;

        const departedTrips = trips.filter(
          (trip) => trip.order_status === "COMPLETED"
        );

        const travellerAmount = departedTrips.reduce((sum, trip) => {
          return sum + Number(trip.traveller_amount || 0);
        }, 0);

        // Обновляем пользователя в базе данных
        await prisma.user.update({
          where: { id: user.id },
          data: {
            number_of_travellers: travellerAmount,
          },
        });

        return {
          ...user,
          booked_trips_count: bookedTripsCount,
          number_of_travellers: travellerAmount,
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
