import mongoose from "mongoose";
import settings from ".";

export const connectDB = async () => {
    try {
        await mongoose.connect(settings.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        process.exit(1);
    }
};

