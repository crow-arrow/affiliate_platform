import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true, 
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        affiliateId: {
            type: String,
            required: true,
            unique: true,
        }
        // role: {
        //     type: String,
        //     enum: ["admin", "genie"],
        //     default: "genie",
        // },
        // affiliateId: {
        //     type: String,
        //     unique: true,
        //     required: true,
        // },
        // commissionRate: {
        //     type: Number,
        //     default: 7,
        // },
        // referralLink: {
        //     type: String, 
        //     required: true,
        // },
        // totalReferrals: {
        //     type: Number,
        //     default: 0,
        // },
        // totalEarnings: {
        //     type: Number,
        //     default: 0,
        // },
        // status: {
        //     type: String,
        //     enum: ["Bronze", "Silver", "Gold"],
        //     default: "Bronze",
        // },
        // createdAt: {
        //     type: Date,
        //     default: Date.now,
        // },
        // updatedAt: {
        //     type: Date,
        //     default: Date.now,
        // }
    },
    {timestamps: true },
)


// UserSchema.pre('save', function(next) {
//     if (this.totalBookings >= 25) {
//         this.status = "Gold";
//     } else if (this.totalBookings >= 10) {
//         this.status = "Silver";
//     } else {
//         this.status = "Bronze";
//     }
//     next();
// });

const User = mongoose.model("User", UserSchema);

export default mongoose.model('User', UserSchema)
