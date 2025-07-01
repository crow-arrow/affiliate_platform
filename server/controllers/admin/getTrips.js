import Trips from "../../models/Trips.js";
import User from "../../models/User.js";

// Get All Trips
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trips.findAll({
      order: [["id", "ASC"]],
    });

    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found" });
    }

    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTripsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [{ model: Trips, as: "affiliateTrips" }],
    });
    if (!user) {
      return res.status(404).json({ massege: "User not found" });
    }

    const trips = user.affiliateTrips;
    res.json({ trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ massege: "Server error", error: error.massege });
  }
};
