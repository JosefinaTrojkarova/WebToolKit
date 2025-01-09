// Connect to mongodb function
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState) {
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
