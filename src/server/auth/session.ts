import { getServerSession } from 'next-auth/next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { connectToDatabase } from '../db/mongoose';
import UserModel from '../db/models/user.model';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error('[Auth] No credentials provided');
          return null;
        }
        try {
          console.log(`[Auth] Attempting login for email: ${credentials.email}`);
          
          // Add timeout to database connection (45 seconds for production MongoDB Atlas)
          const connectPromise = connectToDatabase();
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('[Auth] Database connection timeout')), 45000)
          );
          
          try {
            await Promise.race([connectPromise, timeoutPromise]);
          } catch (connectErr) {
            console.error('[Auth] Database connection failed:', connectErr);
            throw connectErr;
          }
          
          const user = await UserModel.findOne({ email: credentials.email }).lean();
          if (!user) {
            console.log(`[Auth] User not found: ${credentials.email}`);
            return null;
          }
          
          console.log(`[Auth] User found, comparing password for: ${credentials.email}`);
          const ok = await bcrypt.compare(credentials.password, (user as any).passwordHash);
          if (!ok) {
            console.log(`[Auth] Password mismatch for: ${credentials.email}`);
            return null;
          }
          
          console.log(`[Auth] Login successful for: ${credentials.email}`);
          return {
            id: (user as any)._id.toString(),
            email: user.email,
            role: (user as any).role,
            name: user.email,
          } as any;
        } catch (error) {
          console.error('[Auth] Authorization error:', error);
          if (error instanceof Error) {
            console.error('[Auth] Error details:', error.message);
            if (error.message.includes('timeout')) {
              console.error('[Auth] Connection timeout - check MongoDB Atlas');
            }
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export async function getServerAuthSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (err) {
    console.error('Session error:', err);
    return null;
  }
}
