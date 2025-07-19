// pages/faq-tc.js

import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const FAQS = [
  {
    question: "What does CertifiedSkill.org offer?",
    answer:
      "We provide free certification programs and exams to help you showcase your skills and advance your career.",
  },
  {
    question: "Who is eligible to participate?",
    answer:
      "Anyone with a passion for learning is welcome. Our programs are designed for individuals seeking to validate their skills through free certifications.",
  },
  {
    question: "How do I register for a course or exam?",
    answer:
      "Simply click on the 'Sign Up' button on our homepage, create an account, and browse our available certification programs.",
  },
  {
    question: "Is there any cost associated with the certifications?",
    answer: "No. All our certification programs and exams are completely free.",
  },
];

function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 bg-white rounded-lg shadow px-4 py-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full bg-transparent outline-none text-gray-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search FAQs"
        />
      </div>
      <div className="space-y-4">
        {filteredFaqs.length === 0 && (
          <div className="text-center text-gray-500 py-8">No FAQs found.</div>
        )}
        {filteredFaqs.map((faq, idx) => (
          <div key={faq.question} className="bg-white rounded-lg shadow transition-all">
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-panel-${idx}`}
            >
              <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
              <FaChevronDown
                className={`ml-2 w-5 h-5 text-indigo-600 transform transition-transform duration-300 ${openIndex === idx ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-40 py-2 px-6" : "max-h-0 px-6 py-0"}`}
              aria-hidden={openIndex !== idx}
            >
              <p className="text-gray-600 text-base">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
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

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        {/* Header */}
        <Header />
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-indigo-600 to-blue-400 py-16 px-4 text-center flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('/faq-hero.svg')] bg-no-repeat bg-center bg-contain opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-6">
              Find answers to common questions about our free certification platform, exams, and policies.
            </p>

          </div>
        </section>
        <main className="max-w-4xl mx-auto p-6">
          {/* FAQ Accordion Section */}
          <section className="my-12">
            <FAQAccordion faqs={FAQS} />
          </section>
          {/* Terms and Conditions Section */}
          <section className="my-12">
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Terms of Service</h2>
            <div className="space-y-4 bg-white rounded-xl shadow-lg p-8 text-gray-700 text-base leading-relaxed border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Acceptance of Terms</h3>
              <p>By accessing and using CertifiedSkill.org, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">User Obligations</h3>
              <ul className="list-disc ml-6">
                <li>Provide accurate and complete information when registering.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Prohibited Uses</h3>
              <ul className="list-disc ml-6">
                <li>Misuse of the platform or attempt to gain unauthorized access.</li>
                <li>Use of the site for any unlawful or fraudulent purpose.</li>
                <li>Impersonation of any person or entity.</li>
              </ul>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Limitation of Liability</h3>
              <p>CertifiedSkill.org is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the site.</p>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Governing Law</h3>
              <p>These Terms are governed by the laws of your jurisdiction. Any disputes will be resolved in accordance with these laws.</p>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Contact</h3>
              <p>For questions about these Terms, email <a href="mailto:support@certifiedskill.org" className="text-indigo-600 underline">support@certifiedskill.org</a>.</p>
            </div>
          </section>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
