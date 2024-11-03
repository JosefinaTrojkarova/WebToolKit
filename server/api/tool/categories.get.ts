// API endpoint to get data about categories from the database

import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();

    const database = mongoose.connection.useDb('Tools');
    const collection = database.collection('Main');

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
