// Purpose: Delete account.
// WILL BE CHANGED!!!

import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import type { IUser } from '../../models/Users';

export default defineEventHandler(async (event) => {
  // Get the token from the request
  const token = getRequestHeader(event, 'authorization')?.split(' ')[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error',
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    const nitroApp = useNitroApp();
    if (!nitroApp.mongoClient) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection error',
      });
    }

    const mongoClient = nitroApp.mongoClient as MongoClient;
    const db = mongoClient.db('User');
    const UsersCollection = db.collection<IUser>('Users');

    // Delete the user
    const result = await UsersCollection.deleteOne({
      _id: new ObjectId(decoded.userId),
    });

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return { message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Error deleting account:', error);
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'An unknown error occurred',
      });
    }
  }
});
