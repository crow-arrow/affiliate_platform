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
        password: {
            type: String,
            required: true,
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
