// pages/faq-tc.js

import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

// A simple component for each FAQ item
function FAQItem({ question, answer }) {
  return (
    <div className="border p-4 rounded-md bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{question}</h2>
      <p className="mt-2 text-gray-600">{answer}</p>
    </div>
  );
}

export default function FAQTermsPage() {
  return (
    <>
      <Head>
        <title>FAQ & Terms and Conditions | CertifiedSkill.org</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions and review our Terms and Conditions at CertifiedSkill.org."
        />
        <meta
          name="keywords"
          content="FAQ, Terms and Conditions, CertifiedSkill, Certification, Free Exam"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://certifiedskill.org/faq-tc" />
        <meta name="robots" content="index, follow" />

        {/* Preload Critical Asset */}
        <link
          rel="preload"
          href="/og-image-faq.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* OpenGraph Tags */}
        <meta
          property="og:title"
          content="FAQ & Terms and Conditions | CertifiedSkill.org"
        />
        <meta
          property="og:description"
          content="Find answers to frequently asked questions and review our Terms and Conditions at CertifiedSkill.org."
        />
        <meta property="og:url" content="https://certifiedskill.org/faq-tc" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://certifiedskill.org/og-image-faq.jpg"
        />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FAQ & Terms and Conditions | CertifiedSkill.org"
        />
        <meta
          name="twitter:description"
          content="Find answers to frequently asked questions and review our Terms and Conditions at CertifiedSkill.org."
        />
        <meta
          name="twitter:image"
          content="https://certifiedskill.org/og-image-faq.jpg"
        />

        {/* JSON‑LD Structured Data for FAQ Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What does CertifiedSkill.org offer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We provide free certification programs and exams to help you showcase your skills and advance your career."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who is eligible to participate?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Anyone with a passion for learning is welcome. Our programs are designed for individuals seeking to validate their skills through free certifications."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I register for a course or exam?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply click on the 'Sign Up' button on our homepage, create an account, and browse our available certification programs."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there any cost associated with the certifications?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. All our certification programs and exams are completely free."
                  }
                }
              ]
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        <main className="max-w-4xl mx-auto p-6">
          {/* FAQ Section */}
          <section className="my-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <div className="space-y-6">
              <FAQItem
                question="What does CertifiedSkill.org offer?"
                answer="We provide free certification programs and exams to help you showcase your skills and advance your career."
              />
              <FAQItem
                question="Who is eligible to participate?"
                answer="Anyone with a passion for learning is welcome. Our programs are designed for individuals seeking to validate their skills through free certifications."
              />
              <FAQItem
                question="How do I register for a course or exam?"
                answer="Simply click on the 'Sign Up' button on our homepage, create an account, and browse our available certification programs."
              />
              <FAQItem
                question="Is there any cost associated with the certifications?"
                answer="No. All our certification programs and exams are completely free."
              />
            </div>
          </section>

          {/* Terms and Conditions Section */}
          <section className="my-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Terms and Conditions
            </h1>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Acceptance of Terms:</strong> By accessing and using the
                CertifiedSkill.org website, you agree to be bound by these Terms
                and Conditions.
              </p>
              <p>
                <strong>Modifications:</strong> We reserve the right to update or
                modify these terms at any time without prior notice. Your continued use
                of the site constitutes acceptance of any revised terms.
              </p>
              <p>
                <strong>User Responsibilities:</strong> Users are required to provide
                accurate information when signing up. Any misuse of our services may result
                in termination of your account.
              </p>
              <p>
                <strong>Privacy:</strong> Your privacy is important to us. Please review
                our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> to understand how your data is collected and used.
              </p>
              <p>
                <strong>Intellectual Property:</strong> All content on this website is
                the intellectual property of CertifiedSkill.org unless otherwise stated.
                Unauthorized use is prohibited.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> CertifiedSkill.org is not liable
                for any direct or indirect damages arising from the use or inability to use
                our website.
              </p>
              <p>
                <strong>Governing Law:</strong> These Terms and Conditions are governed by
                and construed in accordance with the laws of your jurisdiction.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
