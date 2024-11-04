import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroApp) => {
  try {
    await connectToDatabase();

    nitroApp.hooks.hook('request', async () => {
      if (!mongoose.connection.readyState) {
        await connectToDatabase();
      }
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB in plugin:', error);
  }
});
