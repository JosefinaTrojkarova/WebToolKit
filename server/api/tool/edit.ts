// Purpose: API endpoint to submit an existing tool edit suggestion.

import { MongoClient, ObjectId, Collection } from 'mongodb';
import type { Tool, ToolEdit } from '~/types/types';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { editedBy, name, description, additionalInfo } = body;

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
        const ToolsCollection: Collection<Tool> = db.collection('Tools');
        const EditsCollection: Collection<ToolEdit> = db.collection('Edit');

        // Fetch the existing tool
        const existingTool = await ToolsCollection.findOne({ name: name });

        if (!existingTool) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Tool not found',
            });
        }

        // Create a new edit entry
        const newEdit: ToolEdit = {
            editedBy,
            name,
            description,
            additionalInfo,
            createdAt: new Date().toISOString(),
        };

        const result = await EditsCollection.insertOne(newEdit);

        if (!result.acknowledged) {
            throw new Error('Failed to insert new edit');
        }

        return { message: 'Edit submitted successfully' };
    } catch (error) {
        console.error('Edit submission error:', error);
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