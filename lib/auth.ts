import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const passwordInput = credentials.password.trim();

        // Case-insensitive email lookup so "Tejas@gmail.com" matches "tejas@gmail.com"
        const user = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: "insensitive" },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // Check if password is hashed (starts with $2a$, $2b$, or $2y$ - bcrypt format)
        // or plaintext (for legacy or migrated users)
        let isPasswordValid = false;

        if (
          user.password.startsWith("$2a$") ||
          user.password.startsWith("$2b$") ||
          user.password.startsWith("$2y$")
        ) {
          isPasswordValid = await bcrypt.compare(passwordInput, user.password);
        } else {
          // Plain-text comparison, trim both to avoid hidden spaces
          isPasswordValid =
            passwordInput === (user.password || "").trim();
        }

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        // Fetch user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, approvalStatus: true, approvalAttempts: true }
        });
        token.role = dbUser?.role || 'CUSTOMER';
        token.approvalStatus = dbUser?.approvalStatus || 'PENDING';
        token.approvalAttempts = dbUser?.approvalAttempts ?? 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
        // @ts-expect-error: custom fields on session.user
        session.user.approvalStatus = token.approvalStatus as string;
        // @ts-expect-error: custom fields on session.user
        session.user.approvalAttempts = token.approvalAttempts as number;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
