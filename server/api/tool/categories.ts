// Purpose: API endpoint to get data about categories from the database.
// Used in: pages\explore.vue

export default defineEventHandler(async (event) => {
  try {
    const mongoClient = await getMongoClient();

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
