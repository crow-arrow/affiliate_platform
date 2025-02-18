import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        console.log("MongoDB connected");

        // Логи состояния соединения
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connection established successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB connection lost. Reconnecting...");
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;