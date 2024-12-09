import colors from "colors";
import mongoose from "mongoose";
const url = process.env.MONGODB_CNN || "";
export const connectDB = async() => {
    try {
        const { connection } = await mongoose.connect(url);
        console.log("Database is already");
        console.log(`host: ${connection.host} ---- port:${connection.port}`);
        return connectDB;
    } catch (error) {
        console.log( colors.bgRed.white.bold(`${error.message}`));
        process.exit(1);
    }
}