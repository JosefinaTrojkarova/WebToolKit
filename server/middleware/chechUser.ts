import { MongoClient, Collection } from 'mongodb';
import type { IUser } from '../models/Users';

export default defineEventHandler(async (event) => {
    const path: string = event.node.req.url || '';

    // Only run this middleware for user profile routes
    if (!path.startsWith('/user/')) {
        return;
    }

    const username = path.split('/')[2];

    if (!username) {
        console.log('No username provided');
        return sendRedirect(event, '/404', 302);
    }

    const config = useRuntimeConfig();

    if (!config.mongodbUri) {
        console.error('MongoDB URI is not available');
        return sendRedirect(event, '/error', 302);
    }

    let mongoClient: MongoClient | null = null;

    try {
        mongoClient = new MongoClient(config.mongodbUri);
        await mongoClient.connect();

        const db = mongoClient.db('User');
        const UsersCollection: Collection<IUser> = db.collection('Users');

        const user = await UsersCollection.findOne({ username: username });

        if (!user) {
            console.log('User not found:', username);
            return sendRedirect(event, '/404', 302);
        }
        console.log('User found:', username);
    } catch (error) {
        console.error('Error checking user existence:', error);
        return sendRedirect(event, '/error', 302);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
});