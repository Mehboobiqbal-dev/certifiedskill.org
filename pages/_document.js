// /pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Include universal meta tags that apply to all pages */}
        <meta charSet="UTF-8" />
        <meta name="description" content="CertifiedSkill.org - Your Certification Platform" />
        {/* Do not include <title> or viewport meta here */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
