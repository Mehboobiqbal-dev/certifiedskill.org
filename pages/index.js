// pages/index.js

import SeoHead from "../components/SeoHead";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import Skeleton from 'react-loading-skeleton';
import WelcomeTour from "../components/WelcomeTour";

export default function HomePage() {
  return (
    <>
      <SeoHead
        title="CertifiedSkill.org | Free Online Certification Exams & Digital Credentials"
        description="Take free, industry-recognized certification exams online. Earn digital certificates to boost your career. 100% free, trusted by professionals."
        canonical="https://certifiedskill.org/"
        image="https://certifiedskill.org/og-image-faq.jpg"
      />
      <WelcomeTour />
      <div id="main-content" className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <main className="flex-1 w-full">
        {/* Hero Section */}
          <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                  Get <span className="text-indigo-600">Certified</span>.<br />Showcase Your Skills.
            </h1>
                <p className="mt-4 text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
                  Earn free, industry-recognized certificates and digital badges. Advance your career with verifiable credentials from CertifiedSkill.org.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/sign-up" legacyBehavior>
                    <a className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                      Get Started Free
                    </a>
                  </Link>
                  <Link href="/verify-certificate" legacyBehavior>
                    <a className="inline-block bg-white border border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-8 rounded-lg shadow text-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                      Verify Certificate
                    </a>
              </Link>
            </div>
                {/* Trust Badges */}
                <div className="mt-10 flex flex-col items-center md:items-start">
                  <span className="uppercase text-xs tracking-widest text-gray-400 mb-2">Trusted by professionals at</span>
                  <div className="flex flex-wrap gap-6 opacity-80">
                    <img src="/ChatGPT Image Jul 19, 2025, 01_06_54 PM.png" alt="CertifiedSkill.org Logo" className="h-8" />
                    
                    {/* Add more logos for trust if available */}
                  </div>
                </div>
              </div>
              {/* Illustration */}
              <div className="flex-1 flex justify-center md:justify-end">
                <img src="/certificate_page-0001.jpg" alt="Certificate Illustration" className="w-full max-w-md drop-shadow-xl" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose CertifiedSkill.org?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-indigo-50 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-2xl transition">
                  <h3 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                    Free, Recognized Certification
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Access our certification programs at no cost and enhance your professional profile with credentials recognized by employers worldwide.
                  </p>
                </div>
                <div className="p-8 bg-indigo-50 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-2xl transition">
                  <h3 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 0a4 4 0 01-4 4H8a4 4 0 01-4-4V7a4 4 0 014-4h0a4 4 0 014 4z" /></svg>
                    Digital Badges & Sharing
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Earn digital badges and certificates you can share on LinkedIn, your resume, or anywhere online. Show the world your achievements.
                  </p>
                </div>
                <div className="p-8 bg-indigo-50 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-2xl transition">
                  <h3 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 19a7 7 0 100-14 7 7 0 000 14z" /></svg>
                    Secure & Verifiable
                  </h3>
                <p className="mt-2 text-gray-600">
                    All certificates are digitally signed and instantly verifiable. Employers and institutions can confirm your credentials with a click.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 rounded-full p-4 mb-4">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">1. Sign Up</h4>
                  <p className="text-gray-600">Create your free account in seconds. No credit card required.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 rounded-full p-4 mb-4">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" /></svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">2. Take Exam</h4>
                  <p className="text-gray-600">Choose your certification track and pass the online exam at your own pace.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 rounded-full p-4 mb-4">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">3. Get Certified</h4>
                  <p className="text-gray-600">Receive your digital certificate and badge instantly. Share and verify anytime.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Certificate Preview Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Preview Your Certificate</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <img src="/certificate_page-0001.jpg" alt="Sample Certificate" className="w-full max-w-md rounded-xl shadow-lg border border-indigo-100" />
                <div className="text-left max-w-md">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">Industry-Recognized Credential</h3>
                  <p className="text-gray-600 mb-4">Each certificate is professionally designed, digitally signed, and instantly verifiable. Add it to your LinkedIn, resume, or share it with employers.</p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow transition">See More Examples</button>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
                  <p className="text-gray-700 mb-4">“CertifiedSkill.org helped me land my dream job. The certificate was instantly recognized by my employer!”</p>
                  <div className="flex items-center gap-3 justify-center">
                    <img src="/user1.jpg" alt="User 1" className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Amit S.</div>
                      <div className="text-xs text-gray-500">Software Engineer</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
                  <p className="text-gray-700 mb-4">“The process was simple and the digital badge looks great on my LinkedIn profile. Highly recommend!”</p>
                  <div className="flex items-center gap-3 justify-center">
                    <img src="/user2.jpg" alt="User 2" className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Priya K.</div>
                      <div className="text-xs text-gray-500">Marketing Specialist</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
                  <p className="text-gray-700 mb-4">“I love how easy it is to verify and share my certificate. The platform is top-notch!”</p>
                  <div className="flex items-center gap-3 justify-center">
                    <img src="/user3.jpg" alt="User 3" className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Rahul D.</div>
                      <div className="text-xs text-gray-500">Data Analyst</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
