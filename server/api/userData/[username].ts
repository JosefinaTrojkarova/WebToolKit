import { MongoClient } from 'mongodb';
import type { IUser } from '../../models/Users';

export default defineEventHandler(async (event) => {
    const username = event.context.params?.username;

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username is required',
        });
    }

    const config = useRuntimeConfig();

    if (!config.mongodbUri) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database configuration error',
        });
    }

    let mongoClient: MongoClient | null = null;
    
    try {
        mongoClient = new MongoClient(config.mongodbUri);
        await mongoClient.connect();

        const db = mongoClient.db('User');
        const UsersCollection = db.collection<IUser>('Users');

        const user = await UsersCollection.findOne(
            { username: username },
            { projection: { authentication: 0 } }
        );

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found',
            });
        }

        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'An error occurred while fetching the user',
        });
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
});