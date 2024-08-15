// Purpose: API endpoint to get data about categories from the database.
import { getMongoClient } from '../../utils/mongoUtils';
import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const mongoClient: MongoClient = await getMongoClient();
    const database = mongoClient.db('Tools');
    const collection = database.collection('Categories');

    // Fetch all categories from the collection
    const data = await collection.find({}).toArray();

    return data;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
