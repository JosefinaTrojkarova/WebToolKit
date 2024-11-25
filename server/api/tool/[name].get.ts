// API endpoint to get all the data about one specific tool from the database

import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const { name } = event.context.params as { name: string };
  const query = getQuery(event);
  const isHeader = query.header === 'true';
  const isAlternativesOnly = query.alternativesOnly === 'true';
  const isReviewsOnly = query.reviewsPage === 'true';
  const isResourcesOnly = query.resourcesOnly === 'true';

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool name is required',
    });
  }

  try {
    await connectToDatabase();

    const database = mongoose.connection.useDb('Tools');
    const collection = database.collection('Main');

    // Define projection based on the query parameter
    let projection;
    if (isAlternativesOnly) {
      projection = {
        alternatives: 1,
      };
    } else if (isReviewsOnly) {
      projection = {
        rating: {
          stats: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
          },
          stars: 1,
          reviews: 1,
        },
        pros: {
          name: 1,
          votes: 1,
        },
        cons: {
          name: 1,
          votes: 1,
        },
      };
    } else if (isHeader) {
      projection = {
        name: 1,
        logo: 1,
        shortDescription: 1,
        website: 1,
        rating: {
          stars: 1,
          reviews: 1,
          saves: 1,
        },
      };
    } else if (isResourcesOnly) {
      projection = {
        resources: {
          link: 1,
          type: 1,
          category: 1,
        },
      };
    } else {
      projection = {
        name: 1,
        categories: 1,
        logo: 1,
        description: 1,
        tags: {
          pricing: 1,
          licensing: 1,
        },
        rating: {
          stats: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
          },
          stars: 1,
          reviews: 1,
        },
        resources: {
          link: 1,
          type: 1,
          category: 1,
        },
        video: 1,
        pricingLink: 1,
        pros: {
          name: 1,
          votes: 1,
        },
        cons: {
          name: 1,
          votes: 1,
        },
        alternatives: 1,
      };
    }

    // Find single tool by name and ignore case
    const data = await collection.findOne(
      { name: { $regex: new RegExp(`^${name}$`, 'i') } },
      { projection }
    );

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tool not found',
      });
    }

    return data;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.message === 'MongoDB client is not available') {
        throw createError({
          statusCode: 503,
          statusMessage: 'Service Temporarily Unavailable',
        });
      } else if (error.message === 'Tool not found') {
        throw error;
      }
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
