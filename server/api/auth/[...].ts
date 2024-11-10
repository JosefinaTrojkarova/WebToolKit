import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from 'mongoose';
import { generateUniqueHandle } from '../../utils/generateHandle';

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    maxAge: 86400 * 7, // Session expires after 7 days
    updateAge: 300, // Session is updated every 5 minutes
  },
  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();

      const database = mongoose.connection.useDb('User');
      const collection = database.collection('Users');

      const existingUser = await collection.findOne({ email: user.email });

      if (!existingUser && user.name) {
        await collection.insertOne({
          name: user.name,
          handle: await generateUniqueHandle(user.name, collection),
          email: user.email,
          image: user.image,
          contributions: 0,
        });
      }
      return true;
    },
    async session({ session }: { session: any }) {
      await connectToDatabase();

      const database = mongoose.connection.useDb('User');
      const collection = database.collection('Users');
      const existingUser = await collection.findOne({
        email: session.user.email,
      });

      // If user no longer exists, end the session by returning null
      if (!existingUser) {
        return null;
      }

      return session;
    },
  },
});
