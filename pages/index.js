// pages/index.js

import Head from "next/head";
import Link from "next/link";
import Header from "./Header"; // updated path if using components folder
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
            __html: `{
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
            }`,
          }}
        />

        {/* JSON-LD Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://certifiedskill.org",
              "name": "CertifiedSkill.org",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://certifiedskill.org/search?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }`,
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <section className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Empowering Skilled Individuals through Free Certification Programs
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              CertifiedSkill.org is a non-profit organization dedicated to recognizing and rewarding talent. We offer
              free certifications and certification free exams that help you showcase your skills and advance your
              career.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Our mission is to democratize access to quality credentials and support lifelong learning, ensuring that
              every talented individual has the opportunity to succeed.
            </p>

            <div className="mt-8">
              <Link href="/sign-up">
                <span className="inline-block bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 cursor-pointer">
                  Get Started Today
                </span>
              </Link>
            </div>

            <div className="mt-8">
              <Link href="/verify-certificate">
                <span className="inline-block bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 cursor-pointer">
                  Verify your Certificate
                </span>
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-2xl font-bold text-gray-800">Free Certification</h3>
                <p className="mt-2 text-gray-600">
                  Access our certification programs at no cost and enhance your professional profile.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-2xl font-bold text-gray-800">Empowering Careers</h3>
                <p className="mt-2 text-gray-600">
                  Our certificates help you stand out in the job market and open new career opportunities.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-2xl font-bold text-gray-800">Lifelong Learning</h3>
                <p className="mt-2 text-gray-600">
                  We promote continuous learning and skill development through our free courses and certification
                  programs.
                </p>
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
