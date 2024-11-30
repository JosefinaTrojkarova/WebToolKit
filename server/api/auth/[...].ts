import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';
import { generateUniqueUsername } from '../../utils/generateUsername';
import User from '../../models/User';

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
      try {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser && user.name) {
          const username = await generateUniqueUsername(user.name);

          if (!username) {
            throw new Error('Failed to generate a unique username.');
          }

          await User.create({
            name: user.name,
            username,
            email: user.email,
            image: user.image,
            reviews: [],
            saves: [],
          });
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async session({ session }: { session: any }) {
      await connectToDatabase();
      const existingUser = await User.findOne({
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
