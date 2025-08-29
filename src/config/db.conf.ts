import mongoose from 'mongoose';
import { config } from './env.conf';

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(config.MONGO_URI);
        console.log(`🗄️  MongoDB is running on port: ${connection.port}`);
    } catch (error) {
        console.log(`❌ MongoDB connection error: ${error}`);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed ❌');
};
