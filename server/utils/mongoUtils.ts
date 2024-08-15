// Purpose: Utility to export getMongoClient function and useMongoClient.

import { MongoClient } from 'mongodb';

export async function getMongoClient(): Promise<MongoClient> {
  const nitroApp = useNitroApp();
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

export const useMongoClient = () => {
  const config = useRuntimeConfig();
  return new MongoClient(config.mongodbUri);
};
