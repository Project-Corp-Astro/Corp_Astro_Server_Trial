import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI ;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined in the environment variables');
}
export const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'astro-db',
    });

    console.log('🧠 MongoDB connected (Astrology Service)');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
