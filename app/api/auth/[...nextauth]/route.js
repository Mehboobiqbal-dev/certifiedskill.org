import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcryptjs";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials?.email }).exec();
          if (!user) throw new Error("No user found with that email.");
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password
          );
          if (!isValidPassword) throw new Error("Invalid password.");
          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // For provider sign in, create a new user if one doesn't exist.
      if (account?.provider === "github") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: profile?.email }).exec();
        if (!existingUser) {
          await User.create({
            name: profile?.name,
            email: profile?.email,
            role: 'student' // Default role; adjust as needed.
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString();
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || 'student';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role || 'student',
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
