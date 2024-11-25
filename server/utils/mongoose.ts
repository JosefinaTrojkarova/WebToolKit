// Connect to mongodb

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

export const connectToDatabase = async () => {
  // If already connected, return immediately
  if (isConnected) {
    return;
  }

  // If a connection attempt is in progress, wait for it
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  // Start a new connection attempt
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
      }

      const opts = {
        bufferCommands: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      };

      await mongoose.connect(MONGODB_URI, opts);
      isConnected = true;
      console.log('Connected to MongoDB');
      resolve();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      reject(error);
    } finally {
      connectionPromise = null;
    }
  });

  await connectionPromise;
};

// Add event listeners for connection status
mongoose.connection.on('disconnected', () => {
  isConnected = false;
});

mongoose.connection.on('connected', () => {
  isConnected = true;
});
