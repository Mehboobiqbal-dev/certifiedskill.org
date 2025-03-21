import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster richColors />
    </SessionProvider>
  );
}
