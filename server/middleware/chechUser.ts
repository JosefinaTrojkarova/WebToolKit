// Purpous: Check if a user exists in the database else redirect to 404 page.

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

    const nitroApp = useNitroApp();

    if (!nitroApp.mongoClient) {
        console.error('MongoDB client is not available');
        return sendRedirect(event, '/error', 302);
    }

    try {
        const db = nitroApp.mongoClient.db('User');
        const UsersCollection = db.collection<IUser>('Users');

        const user = await UsersCollection.findOne({ username: username });

        if (!user) {
            console.log('User not found:', username);
            return sendRedirect(event, '/404', 302);
        }
        console.log('User found:', username);
    } catch (error) {
        console.error('Error checking user existence:', error);
        return sendRedirect(event, '/error', 302);
    }
});