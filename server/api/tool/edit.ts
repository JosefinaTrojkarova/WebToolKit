// Purpose: API endpoint to submit an existing tool edit suggestion.
import { Collection } from 'mongodb';
import type { Tool, ToolSuggestion } from '~~/types/types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { suggestedBy, name, description, additionalInfo } = body;

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool name is required',
    });
  }

  try {
    const mongoClient = await getMongoClient();

    if (!mongoClient) {
      console.error('MongoDB client is not available');
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection error',
      });
    }

    const db = mongoClient.db('Tools');
    const ToolsCollection: Collection<Tool> = db.collection('Main');
    const EditsCollection: Collection<ToolSuggestion> = db.collection('Edit');

    // Fetch the existing tool (case-insensitive)
    const existingTool = await ToolsCollection.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (!existingTool) {
      console.error(`Tool not found: ${name}`);
      throw createError({
        statusCode: 404,
        statusMessage: `Tool not found: ${name}`,
      });
    }

    // Create a new edit suggestion
    const newEdit: ToolSuggestion = {
      suggestedBy,
      name: existingTool.name,
      description,
      additionalInfo,
      createdAt: new Date().toISOString(),
      // add fields later + add them to types.ts
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
        statusCode: error.message.includes('not found') ? 404 : 500,
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
