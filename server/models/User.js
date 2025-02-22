import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        username: {
            type: String,
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
        phone: {
            type: String,
            required: true,
            match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
        },
        password: {
            type: String,
            required: true,
        },
        couponCode: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['Genie', 'Admin'],
            default: 'Genie',
        },
        level: {
            type: String,
            enum: ['Bronze', 'Silver', 'Gold'],
            default: 'Bronze',
        },
        trips: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Trips',
            }
        ],
    },
    { timestamps: true }, // Автоматически добавляет createdAt и updatedAt
)

UserSchema.pre('save', function (next) {
    if (this.isModified('email') && !this.username) {
      this.username = this.email; // Устанавливаем username в email
    }
    next();
})

export default mongoose.model('User', UserSchema)
