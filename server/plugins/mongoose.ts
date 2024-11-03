export default defineNitroPlugin(async () => {
  try {
    await connectToDatabase();
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});
