import { MongoClient, ObjectId, Collection } from 'mongodb';
import jwt from 'jsonwebtoken';
import type  { IUser } from '../models/Users';

export default defineEventHandler(async (event) => {
    const token = getRequestHeader(event, 'authorization')?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        throw createError({
            statusCode: 401,
            statusMessage: 'No token provided',
        });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not set in environment variables');
            throw createError({
                statusCode: 500,
                statusMessage: 'Server configuration error',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret) as { userId: string };
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid token',
            });
        }

        const nitroApp = useNitroApp();
        console.log('Nitro app:', nitroApp);
        console.log('MongoDB client:', nitroApp.mongoClient);

        if (!nitroApp.mongoClient) {
            console.error('MongoDB client is not available in Nitro app');
            throw createError({
                statusCode: 500,
                statusMessage: 'Database connection error',
            });
        }

        const mongoClient = nitroApp.mongoClient as MongoClient;
        const db = mongoClient.db('User');
        const UsersCollection: Collection<IUser> = db.collection('Users');

        const user = await UsersCollection.findOne(
            { _id: new ObjectId(decoded.userId) },
            { projection: { authentication: 0 } }
        );

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found',
            });
        }

        return {
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Error fetching user:', error);
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