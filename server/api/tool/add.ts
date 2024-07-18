import { MongoClient, ObjectId, Collection } from 'mongodb';
import type { ISuggestion } from '~/types/types';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { toolId, suggestedBy, name, description, additionalInfo } = body;

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

        const db = mongoClient.db('Tools');
        const SuggestionsCollection: Collection<ISuggestion> = db.collection('Create');

        // Create a new suggestion
        const newSuggestion: ISuggestion = {
            suggestedBy,
            name,
            description,
            additionalInfo,
            createdAt: new Date().toISOString(),
        };
        const result = await SuggestionsCollection.insertOne(newSuggestion);

        if (!result.acknowledged) {
            throw new Error('Failed to insert new suggestion');
        }

        return { message: 'Suggestion submitted successfully' };
    } catch (error) {
        console.error('Suggestion submission error:', error);
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
