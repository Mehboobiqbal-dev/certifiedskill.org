// pages/careers.js

import Head from "next/head";
import { useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FaBriefcase, FaCode, FaUserCheck } from "react-icons/fa";

const positions = [
  {
    title: "Frontend Developer",
    description:
      "Help create a responsive and intuitive user interface using modern web technologies (React/Next.js, Tailwind CSS) to make our platform accessible and engaging.",
    icon: <FaCode className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Backend Developer",
    description:
      "Contribute to building robust APIs and server-side functionality using Node.js, Next.js API routes, and database management to ensure our platform performs reliably.",
    icon: <FaBriefcase className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Exam Creator / Professor",
    description:
      "Assist in designing and curating exam content that is both comprehensive and effective—ideal for seasoned educators and professionals passionate about teaching.",
    icon: <FaUserCheck className="w-8 h-8 text-indigo-600" />,
  },
];

export default function CareersPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", cover: "", resume: null });
  const [resumeName, setResumeName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const openForm = (position) => {
    setSelectedPosition(position);
    setShowForm(true);
    setForm({ name: "", email: "", cover: "", resume: null });
    setResumeName("");
    setSubmitted(false);
    setError("");
  };
  const closeForm = () => setShowForm(false);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
      setResumeName(files[0]?.name || "");
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setForm((f) => ({ ...f, resume: file }));
      setResumeName(file.name);
    }
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleResumeClick = () => fileInputRef.current.click();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cover || !form.resume) {
      setError("All fields are required.");
      return;
    }
    setError("");
    // TODO: Implement backend submission logic
    setSubmitted(true);
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
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-200 py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/careers-bg.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <h1 className="text-5xl font-extrabold text-white drop-shadow mb-4">Join Our Mission</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          Make a real impact in global education. Volunteer with CertifiedSkill.org and help democratize access to world-class certifications.
        </p>
        <span className="inline-block bg-white/20 text-white font-semibold px-4 py-2 rounded-full text-sm tracking-widest mb-2">
          100% Remote · Flexible Hours · Real Impact
        </span>
      </section>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-10">Open Volunteer Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {positions.map((pos) => (
              <div key={pos.title} className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 flex flex-col items-center text-center hover:shadow-2xl transition group">
                <div className="mb-4 group-hover:scale-110 transition-transform">{pos.icon}</div>
                <h3 className="text-xl font-bold text-indigo-700 mb-2">{pos.title}</h3>
                <p className="text-gray-600 mb-6">{pos.description}</p>
                <button
                  className="bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200"
                  onClick={() => openForm(pos.title)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-slide-up">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={closeForm}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Apply for {selectedPosition}</h2>
              {submitted ? (
                <div className="text-green-600 font-semibold text-center py-8">Thank you for applying! We will review your application and contact you soon.</div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="peer w-full border-b-2 border-indigo-200 focus:border-indigo-600 bg-transparent px-0 py-2 text-lg focus:outline-none"
                      required
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-2 text-gray-500 text-base transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs text-indigo-600">
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="peer w-full border-b-2 border-indigo-200 focus:border-indigo-600 bg-transparent px-0 py-2 text-lg focus:outline-none"
                      required
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-2 text-gray-500 text-base transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs text-indigo-600">
                      Email
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      name="cover"
                      value={form.cover}
                      onChange={handleChange}
                      className="peer w-full border-b-2 border-indigo-200 focus:border-indigo-600 bg-transparent px-0 py-2 text-lg focus:outline-none resize-none"
                      rows={4}
                      required
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-2 text-gray-500 text-base transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-5 text-xs text-indigo-600">
                      Cover Letter
                    </label>
                  </div>
                  <div
                    className="border-2 border-dashed border-indigo-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 transition"
                    onClick={handleResumeClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      name="resume"
                      accept="application/pdf"
                      onChange={handleChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <span className="block text-gray-500 mb-2">Drag & drop your resume here, or <span className="text-indigo-600 underline">browse</span></span>
                    <span className="block text-sm text-gray-700 font-medium">{resumeName || "No file selected"}</span>
                  </div>
                  {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200 mt-2"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
