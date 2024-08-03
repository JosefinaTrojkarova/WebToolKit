// Purpose: API endpoint to get basic data about all the tools from the database. Used in app\pages\explore.vue

import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();

  // Function to get the MongoDB client with retry logic
  async function getMongoClient(): Promise<MongoClient> {
    let retries = 0;
    const maxRetries = 10;
    const retryDelay = 500;

    while (retries < maxRetries) {
      if (nitroApp.mongoClient) {
        return nitroApp.mongoClient;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    }
    // Throw an error if the MongoDB client is not available after max retries
    throw new Error('MongoDB client is not available');
  }

  try {
    // Get the MongoDB client
    const mongoClient = await getMongoClient();

    // Parse query parameters from the request
    const query = getQuery(event);
    const explore = query.explore === 'true';
    const contribute = query.contribute === 'true';
    const searchQuery = query.search as string;
    const categories = query.categories
      ? (query.categories as string).split(',')
      : [];

    // Connect to the 'Tools' database and the 'Main' collection
    const database = mongoClient.db('Tools');
    const collection = database.collection('Main');

    let data;

    if (searchQuery || categories.length > 0) {
      // Define the aggregation pipeline for Atlas Search
      const pipeline = [
        {
          $search: {
            index: 'ToolsSearch',
            compound: {
              should: [
                ...(searchQuery
                  ? [
                      {
                        autocomplete: {
                          query: searchQuery,
                          path: 'name',
                          tokenOrder: 'sequential',
                        },
                      },
                      {
                        wildcard: {
                          query: `*${searchQuery}*`,
                          path: 'name',
                          allowAnalyzedField: true,
                        },
                      },
                      {
                        text: {
                          query: searchQuery,
                          path: 'name',
                        },
                      },
                    ]
                  : []),
                ...(categories.length > 0
                  ? [
                      {
                        text: {
                          query: categories,
                          path: 'categories',
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        },
        {
          // Define the fields to include in the search results
          $project: explore
            ? {
                name: 1,
                description: 1,
                logo: 1,
                categories: 1,
                tags: {
                  pricing: 1,
                  licensing: 1,
                },
                rating: {
                  stars: 1,
                  reviews: 1,
                  saves: 1,
                },
              }
            : contribute
            ? { name: 1 }
            : {},
        },
      ];

      // Execute the aggregation pipeline and get the results
      data = await collection.aggregate(pipeline).toArray();
    } else {
      // Regular query when there's no search
      const projection = explore
        ? {
            name: 1,
            description: 1,
            logo: 1,
            categories: 1,
            'tags.pricing': 1,
            'tags.licensing': 1,
            'rating.stars': 1,
            'rating.reviews': 1,
            'rating.saves': 1,
          }
        : contribute
        ? { name: 1 }
        : {};

      // Execute the regular query and get the results
      data = await collection
        .find(
          {
            ...(categories.length > 0
              ? { categories: { $in: categories } }
              : {}),
          },
          { projection }
        )
        .toArray();
    }

    return data;
  } catch (error) {
    console.error('Detailed error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
