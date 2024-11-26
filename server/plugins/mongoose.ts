// Plugin to connect to database
import mongoose from 'mongoose';

export default defineNitroPlugin((nitroApp) => {
  connectToDatabase().catch((error) => {
    console.error('Failed to connect to MongoDB in plugin:', error);
    process.exit(1);
  });

  nitroApp.hooks.hook('request', async () => {
    if (!mongoose.connection.readyState) {
      await connectToDatabase();
    }
  });
});
