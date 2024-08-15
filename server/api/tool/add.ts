// Purpose: API endpoint to submit a new tool suggestion.
import { Collection } from 'mongodb';
import type { ToolSuggestion } from '~~/types/types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { suggestedBy, name, description, additionalInfo } = body;

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
    const SuggestionsCollection: Collection<ToolSuggestion> =
      db.collection('Create');

    // Create a new add suggestion
    const newAdd: ToolSuggestion = {
      suggestedBy,
      name,
      description,
      additionalInfo,
      createdAt: new Date().toISOString(),
      // add fields later + add them to types.ts
    };
    const result = await SuggestionsCollection.insertOne(newAdd);

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
