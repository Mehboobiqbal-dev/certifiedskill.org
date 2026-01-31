import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SkeletonTheme baseColor="#e0e7ef" highlightColor="#f3f4f6">
        <div className="overflow-x-hidden">
          <Component {...pageProps} />
          <Toaster richColors />
          <Analytics />
        </div>
      </SkeletonTheme>
    </SessionProvider>
  );
}
