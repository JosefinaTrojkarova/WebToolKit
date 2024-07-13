import { MongoClient } from 'mongodb';

declare module 'nitropack' {
  interface NitroApp {
    mongoClient: MongoClient;
  }
}

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();
  let client: MongoClient;

  try {
    client = new MongoClient(config.mongodbUri);
    await client.connect();
    console.log('Connected to MongoDB');

    nitroApp.mongoClient = client;

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }

  nitroApp.hooks.hook('close', async () => {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  });
});