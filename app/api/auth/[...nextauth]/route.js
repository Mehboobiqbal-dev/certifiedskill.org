// route.js
import NextAuth from "next-auth";
import { authOptions } from "./authoption";

// Force dynamic rendering so Next.js doesn’t pre-render this API route.
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

// Export GET and POST so that your route works in the App Router.
export { handler as GET, handler as POST };
