// route.js
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// Force dynamic rendering so Next.js won’t pre-render this API route.
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

// Export GET and POST handlers for the App Router API route.
export { handler as GET, handler as POST };
