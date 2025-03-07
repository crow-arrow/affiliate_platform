import Trips from "../models/Trips.js"

// Get All Trips
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trips.findAll({
            order: [['id', 'ASC']]
        })

        if (trips.length === 0) {
            return res.status(404).json({ message: "No trips found" })
        }

        res.json(trips)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

