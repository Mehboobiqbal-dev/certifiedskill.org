import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import User from "../../../pages/models/user";
import connectToDatabase from "../../../lib/db";
import bcrypt from "bcryptjs";

const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
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
          const user = await (User as any)
            .findOne({ email: credentials?.email })
            .exec();
          if (!user) {
            throw new Error("No user found with that email.");
          }
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            throw new Error("Invalid password.");
          }
          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn(params: any) {
      const { account, profile } = params;
      if (account?.provider === "github") {
        await connectToDatabase();
        const existingUser = await (User as any)
          .findOne({ email: profile?.email })
          .exec();
        if (!existingUser) {
          await (User as any).create({
            name: profile?.name,
            email: profile?.email,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  // Remove or comment out the custom signIn page setting:
  // pages: { signIn: "/sign-in" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
