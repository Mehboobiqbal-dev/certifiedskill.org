import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// Force dynamic rendering to prevent Next.js from pre-rendering the API route.
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

// Export GET and POST handlers.
export { handler as GET, handler as POST };
