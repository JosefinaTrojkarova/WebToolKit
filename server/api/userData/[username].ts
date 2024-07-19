// Purpose: Get user's username and email data the database.

import type { IUser } from '../../models/Users';

export default defineEventHandler(async (event) => {
    // gets username from the URL
    const username = event.context.params?.username;

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username is required',
        });
    }

    const nitroApp = useNitroApp();

    if (!nitroApp.mongoClient) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database connection error',
        });
    }

    try {
        const db = nitroApp.mongoClient.db('User');
        const UsersCollection = db.collection<IUser>('Users');

        // find username
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
    }
});