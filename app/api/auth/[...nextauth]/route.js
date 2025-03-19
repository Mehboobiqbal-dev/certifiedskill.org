// File: app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

// Adjust these imports as needed
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";

// The authOptions object for NextAuth configuration.
export const authOptions = {
  session: {
    // Using JSON Web Tokens for session handling
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // Ensure credentials exist
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and Password must be provided");
        }

        await connectToDatabase();

        // Find the user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with that email.");
        }

        // Compare the password with the hashed password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid password.");
        }

        // If everything is valid, return the user object.
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // When signing in with GitHub, check if the user exists.
      if (account?.provider === "github") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          // Create user if they don't exist
          await User.create({
            name: profile?.name || profile?.login,
            email: profile?.email,
            role: "student",
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // If a user object is available (e.g., at sign in) add its info to the token.
      if (user) {
        token.id = user._id.toString();
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token values to the session object
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role || "student",
        };
      }
      return session;
    },
  },
  pages: {
    // Redirect users to this page when they need to sign in.
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Force dynamic rendering in the App Router so that Next.js doesn’t statically generate this API route.
export const dynamic = "force-dynamic";

// Create the NextAuth handler using the authOptions.
const handler = NextAuth(authOptions);

// Export GET and POST handlers so that Next.js route handlers work as expected.
export { handler as GET, handler as POST };
