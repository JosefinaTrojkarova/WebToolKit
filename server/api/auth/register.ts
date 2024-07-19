// Purpose: Register a new user.

import { MongoClient, ObjectId, Collection } from 'mongodb';
import bcrypt from 'bcrypt';
import type { IUser } from '../../models/Users';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password } = body;

  // connect to mongo
  try {
    const nitroApp = useNitroApp();
    const mongoClient = nitroApp.mongoClient as MongoClient | undefined;

    if (!mongoClient) {
      console.error('MongoDB client is not available');
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection error',
      });
    }

    const db = mongoClient.db('User');
    const UsersCollection: Collection<IUser> = db.collection('Users');

    // check if the user already exists
    const existingUser = await UsersCollection.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User with this email or username already exists',
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser: IUser = {
      username,
      email,
      authentication: {
        password: hashedPassword,
        salt: salt,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await UsersCollection.insertOne(newUser);

    if (!result.acknowledged) {
      throw new Error('Failed to insert new user');
    }

    return { message: 'User registered successfully' };
  } catch (error) {
    console.error('Registration error:', error);
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
