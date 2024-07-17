import { MongoClient } from 'mongodb';

declare module 'nitropack' {
  interface NitroApp {
    mongoClient: MongoClient | null | undefined;
  }
}

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();

  // function to connect to MongoDB with retries
  async function connectWithRetry(maxRetries = 5, delay = 5000) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const client = new MongoClient(config.mongodbUri);
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
      } catch (error) {
        console.error(`Failed to connect to MongoDB (attempt ${retries + 1}/${maxRetries}):`, error);
        retries++;
        if (retries >= maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // connect to MongoDB
  try {
    nitroApp.mongoClient = await connectWithRetry();
  } catch (error) {
    console.error('Failed to connect to MongoDB after multiple attempts:', error);
    nitroApp.mongoClient = null;
  }

  // close MongoDB connection on Nitro app close
  nitroApp.hooks.hook('close', async () => {
    if (nitroApp.mongoClient) {
      await nitroApp.mongoClient.close();
      console.log('MongoDB connection closed');
    }
  });
});