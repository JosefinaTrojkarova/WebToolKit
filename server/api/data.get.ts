// API endpoint to get basic data about all the tools from the database and search throught them.

import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();

    const database = mongoose.connection.useDb('Tools');
    const collection = database.collection('Main');

    // Parse query parameters from the request
    const query = getQuery(event);
    const explore = query.explore === 'true';
    const searchQuery = query.search as string;

    let data;

    if (searchQuery) {
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
                        // searches for sequential tokens
                        autocomplete: {
                          query: searchQuery,
                          path: 'name',
                          tokenOrder: 'sequential',
                          fuzzy: {
                            maxEdits: 1,
                          },
                        },
                      },
                      {
                        // searches for sequential tokens without correction
                        autocomplete: {
                          query: searchQuery,
                          path: 'name',
                          tokenOrder: 'sequential',
                        },
                      },
                      {
                        // searches anywhere in the word
                        wildcard: {
                          query: `*${searchQuery}*`,
                          path: 'name',
                          allowAnalyzedField: true,
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
            : {},
        },
      ];

      // Execute the aggregation pipeline and store the results
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
        : {};

      // Execute the regular query and store the results
      data = await collection.find({}, { projection }).toArray();
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
