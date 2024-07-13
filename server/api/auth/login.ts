import { MongoClient, ObjectId, Collection } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type  { IUser } from '../../models/Users';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    try {
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

        const user = await UsersCollection.findOne({ email });
        if (!user || !user.authentication) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.authentication.password);
        if (!isPasswordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email or password',
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not set in environment variables');
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return {
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Login error:', error);
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