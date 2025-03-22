// pages/careers.js

import Head from "next/head";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Application submitted successfully! We will get back to you shortly.");
        setFormData({ name: "", email: "", role: "", message: "" });
      } else {
        setStatus(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Volunteer Opportunities | CertifiedSkill.org</title>
        <meta
          name="description"
          content="Apply to volunteer as a Frontend Developer, Backend Developer, or Exam Creator/Professor at CertifiedSkill.org. Join our mission to democratize education and gain valuable experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://certifiedskill.org/careers" />
        <meta name="robots" content="index, follow" />

        {/* OpenGraph Tags */}
        <meta property="og:title" content="Volunteer Opportunities | CertifiedSkill.org" />
        <meta
          property="og:description"
          content="Apply to volunteer as a Frontend Developer, Backend Developer, or Exam Creator/Professor at CertifiedSkill.org. Join our mission to democratize education and gain valuable experience."
        />
        <meta property="og:url" content="https://certifiedskill.org/careers" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://certifiedskill.org/og-image-volunteer.jpg" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Volunteer Opportunities | CertifiedSkill.org" />
        <meta
          name="twitter:description"
          content="Apply to volunteer as a Frontend Developer, Backend Developer, or Exam Creator/Professor at CertifiedSkill.org. Join our mission to democratize education and gain valuable experience."
        />
        <meta name="twitter:image" content="https://certifiedskill.org/og-image-volunteer.jpg" />

        {/* Structured Data: Job Posting Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "JobPosting",
              "title": "Volunteer Opportunity",
              "description":
                "Volunteer positions available at CertifiedSkill.org for Frontend Developer, Backend Developer, and Exam Creator/Professor roles. Join our nonprofit mission to democratize education and gain valuable experience.",
              "identifier": {
                "@type": "PropertyValue",
                "name": "CertifiedSkill.org",
                "value": "volunteer-opportunity-001",
              },
              "datePosted": new Date().toISOString(),
              "hiringOrganization": {
                "@type": "Organization",
                "name": "CertifiedSkill.org",
                "sameAs": "https://certifiedskill.org",
                "logo": "https://certifiedskill.org/logo.png",
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Remote/Virtual",
                  "addressLocality": "",
                  "addressRegion": "",
                  "postalCode": "",
                  "addressCountry": "Worldwide",
                },
              },
              "employmentType": "VOLUNTEER",
              "incentiveCompensation": "Unpaid",
            }),
          }}
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Volunteer Opportunities
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            CertifiedSkill.org is a nonprofit organization committed to democratizing education. We are looking for passionate volunteers to join our team in the following roles:
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold text-gray-800">
                Frontend Developer
              </h2>
              <p className="text-gray-600">
                Help create a responsive and intuitive user interface using modern web technologies (React/Next.js, Tailwind CSS) to make our platform accessible and engaging.
              </p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold text-gray-800">
                Backend Developer
              </h2>
              <p className="text-gray-600">
                Contribute to building robust APIs and server-side functionality using Node.js, Next.js API routes, and database management to ensure our platform performs reliably.
              </p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold text-gray-800">
                Exam Creator / Professor
              </h2>
              <p className="text-gray-600">
                Assist in designing and curating exam content that is both comprehensive and effective—ideal for seasoned educators and professionals passionate about teaching.
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-6">
            Please note that all volunteer opportunities at CertifiedSkill.org are unpaid. We appreciate your dedication and commitment to our mission.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Apply Now
          </h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700 font-medium">
                Select a Role
              </label>
              <select
                name="role"
                id="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="">-- Choose a Role --</option>
                <option value="frontend-developer">Volunteer Frontend Developer</option>
                <option value="backend-developer">Volunteer Backend Developer</option>
                <option value="exam-creator">Volunteer Exam Creator / Professor</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-medium">
                Short Message / Cover Letter
              </label>
              <textarea
                name="message"
                id="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder="Tell us about yourself and why you want to volunteer"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-black py-3 rounded font-semibold transition"
            >
              Submit Application
            </button>
            {status && (
              <p className="mt-4 text-center text-gray-700">{status}</p>
            )}
          </form>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
