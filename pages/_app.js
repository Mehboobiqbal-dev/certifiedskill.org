import '../styles/globals.css';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Ensure focus ring is visible for keyboard users
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);

  return (
    <>
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-to-content fixed top-2 left-2 z-50 bg-indigo-700 text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-transform -translate-y-16 focus:translate-y-0">Skip to main content</a>
      {/* Google Analytics (replace G-XXXXXXX with your ID) */}
      {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
      <script dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXX');`,
      }} /> */}
      {/* Google Search Console verification (replace with your code) */}
      {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
      <Component {...pageProps} />
    </>
  );
} 