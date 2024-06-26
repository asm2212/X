import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

async function configureAuth() {
  try {
    const client = await clientPromise();
    const db = client.db(); // Get the database instance

    const adapter = new MongoDBAdapter({
      db,
      collection: 'sessions', // Specify the collection name for sessions
    });

    const authOptions = {
      adapter,
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ],
      pages: {
        signIn: '/login',
      },
      session: {
        strategy: 'jwt',
      },
      callbacks: {
        session: async ({ token, session }) => {
          if (session?.user && token?.sub) {
            session.user.id = token.sub;
          }
          return session;
        },
      },
    };

    return NextAuth(authOptions);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
  
}

export default configureAuth;