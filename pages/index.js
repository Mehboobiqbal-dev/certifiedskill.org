// pages/index.js
import Head from "next/head";
import Link from "next/link";
import Header from "./Header"; // Adjust path if using a components folder
import Footer from "./Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Free Certification Programs | CertifiedSkill.org</title>
        <meta
          name="description"
          content="CertifiedSkill.org is dedicated to recognizing and rewarding talent with free certifications and certification free exams. Showcase your skills and advance your career with our free certification programs."
        />
        <meta
          name="keywords"
          content="free certification, certification free exam, free certificate, free certification program, free exam, skill certification, talent recognition"
        />
        <meta name="author" content="CertifiedSkill.org" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://certifiedskill.org" />

        {/* Preload critical images */}
        <link rel="preload" href="/og-image.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />

        {/* OpenGraph Tags */}
        <meta property="og:title" content="Free Certification Programs | CertifiedSkill.org" />
        <meta
          property="og:description"
          content="Join our free certification programs and certification free exams to boost your career. Empower your skills with CertifiedSkill.org."
        />
        <meta property="og:image" content="https://certifiedskill.org/og-image.jpg" />
        <meta property="og:url" content="https://certifiedskill.org" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Certification Programs | CertifiedSkill.org" />
        <meta
          name="twitter:description"
          content="Experience free certification and certification free exams to elevate your skills. Join CertifiedSkill.org and advance your career."
        />
        <meta name="twitter:image" content="https://certifiedskill.org/og-image.jpg" />

        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "CertifiedSkill.org",
                "url": "https://certifiedskill.org",
                "logo": "https://certifiedskill.org/logo.png",
                "description": "CertifiedSkill.org offers free certifications and exams to skilled individuals, helping you showcase your abilities and advance your career.",
                "sameAs": [
                  "https://facebook.com/certifiedskill",
                  "https://twitter.com/certifiedskill",
                  "https://linkedin.com/company/certifiedskill"
                ]
              }
            `,
          }}
        />

        {/* JSON-LD Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://certifiedskill.org",
                "name": "CertifiedSkill.org",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://certifiedskill.org/search?query={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            `,
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header with glassmorphism */}
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative flex items-center justify-center h-screen overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-pink-600 to-red-600 opacity-90"></div>
            {/* Hero Content */}
            <div className="relative z-10 text-center max-w-3xl px-6 text-black">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-black">
                Empower Your Future with Free Certifications
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-8 drop-shadow-lg text-black">
                Unlock your potential and set yourself apart. With our free certification exams and specialized training, 
                we help you shine in your professional journey.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link
                  href="/sign-up"
                  className="bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-black font-bold py-3 px-8 rounded shadow-lg transform hover:scale-105"
                >
                  Get Started Today
                </Link>
                <Link
                  href="/verify-certificate"
                  className="bg-green-500 hover:bg-green-700 transition-all duration-300 text-black font-bold py-3 px-8 rounded shadow-lg transform hover:scale-105"
                >
                  Verify Certificate
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-black mb-12">
                Why Choose CertifiedSkill.org?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-700 p-8 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-4 text-black">Free Certification</h3>
                  <p className="text-black">
                    Access high-quality certification programs at no cost, boosting your career growth opportunities.
                  </p>
                </div>
                <div className="bg-gray-700 p-8 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-4 text-black">Career Advancement</h3>
                  <p className="text-black">
                    Our certifications open doors to new career opportunities and professional development avenues.
                  </p>
                </div>
                <div className="bg-gray-700 p-8 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-4 text-black">Lifelong Learning</h3>
                  <p className="text-black">
                    Continuous learning is at the heart of success. Our programs motivate you to unlock lifelong learning.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
