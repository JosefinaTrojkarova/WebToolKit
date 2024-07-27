// Purpose: API endpoint to get basic data about all the tools from the database.

import { MongoClient } from "mongodb";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();

  // function to get the mongo query
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
    throw new Error("MongoDB client is not available");
  }

  try {
    const mongoClient = await getMongoClient();

    const cacheKey = "toolsData";
    const query = getQuery(event);
    const explore = query.explore === "true";
    const contribute = query.contribute === "true";
    const searchQuery = query.search as string;

    // check if the data is already cached and return it
    const cachedData = cache.get(
      cacheKey +
        (explore ? "_explore" : contribute ? "_contribute" : "_full") +
        (searchQuery ? `_${searchQuery}` : "")
    );
    if (cachedData) {
      return cachedData;
    }

    const database = mongoClient.db("Tools");
    const collection = database.collection("Main");

    let data;

    if (searchQuery) {
      // Atlas Search
      const pipeline = [
        {
          $search: {
            index: "ToolsSearch",
            autocomplete: {
              query: searchQuery,
              path: "name",
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1,
              },
            },
          },
        },
        {
          $project: explore
            ? {
                name: 1,
                description: 1,
                logo: 1,
                tag: {
                  pricing: 1,
                  licensing: 1,
                  rating: 1,
                },
              }
            : contribute
            ? { name: 1 }
            : {},
        },
      ];

      data = await collection.aggregate(pipeline).toArray();
    } else {
      // Regular query when there's no search
      const projection = explore
        ? {
            name: 1,
            description: 1,
            logo: 1,
            "tag.pricing": 1,
            "tag.licensing": 1,
            "tag.rating": 1,
          }
        : contribute
        ? { name: 1 }
        : {};

      data = await collection.find({}, { projection }).toArray();
    }

    cache.set(
      cacheKey +
        (explore ? "_explore" : contribute ? "_contribute" : "_full") +
        (searchQuery ? `_${searchQuery}` : ""),
      data
    );

    return data;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
