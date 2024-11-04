import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from 'mongoose';

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();

      const database = mongoose.connection.useDb('User');
      const collection = database.collection('Users');

      const existingUser = await collection.findOne({ email: user.email });

      if (!existingUser) {
        await collection.insertOne({
          name: user.name,
          handle: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
  },
});
