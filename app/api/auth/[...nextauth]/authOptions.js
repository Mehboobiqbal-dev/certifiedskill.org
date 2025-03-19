// authoption.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verify that credentials, email, and password are provided
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and Password must be provided");
        }

        // Connect to the database
        await connectToDatabase();

        // Find the user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with that email.");
        }

        // Compare the provided password with the stored hashed password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid password.");
        }

        // Return the user object on successful authentication
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // At sign in, attach the user's info to the token
      if (user) {
        token.id = user._id.toString();
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user properties on the client via session object
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
    // Specify the sign-in page URL
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
