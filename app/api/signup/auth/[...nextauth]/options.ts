import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Please provide both email/username and password");
          }

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier as string },
                { username: credentials.identifier as string },
              ],
            },
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          // Match password
          const matchPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!matchPassword) {
            throw new Error("Incorrect password");
          }

          // Return user object with all needed properties
          return {
            id: user.id,
            _id: user.id, // or user._id if you're using MongoDB
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id as string | undefined;
        token.isVerified = user.isVerified as boolean | undefined;
        token.isAcceptingMessages = user.isAcceptingMessages as
          | boolean
          | undefined;
        token.username = user.username as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string | undefined;
        session.user.username = token.username as string | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
        session.user.isAcceptingMessages = token.isAcceptingMessages as
          | boolean
          | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
