import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div className="overflow-x-hidden">
        <Component {...pageProps} />
        <Toaster richColors />
        <Analytics />
      </div>
    </SessionProvider>
  );
}
