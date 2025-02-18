import mongoose from "mongoose"

const TripsSchema = new mongoose.Schema({
    order_id: {
        type: Number,
        required: true,
    },
    travel_date: { 
        type: Date 
    },
    traveller_amount: { 
        type: Number, 
        required: true 
    },
    coupon_code: { 
        type: String 
    },
    order_status: { 
        type: String, 
        required: true 
    },
    total_price: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String 
    },
}, { timestamps: true })

export default mongoose.model("Trips", TripsSchema)