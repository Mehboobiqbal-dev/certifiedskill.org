import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <SeoHead
        title="Privacy Policy | CertifiedSkill.org"
        description="Read our Privacy Policy to learn how CertifiedSkill.org collects, uses, and protects your data."
        canonical="https://certifiedskill.org/privacy"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-3xl mx-auto p-8">
          <section className="my-12">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Privacy Policy</h1>
            <p className="text-gray-700 mb-6">Your privacy is important to us. This policy explains how we collect, use, and protect your information at CertifiedSkill.org.</p>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">What Data We Collect</h2>
                <ul className="list-disc ml-6 text-gray-600">
                  <li>Account information (name, email, password)</li>
                  <li>Exam results and certificates</li>
                  <li>Usage data (pages visited, actions taken)</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">How We Use Data</h2>
                <ul className="list-disc ml-6 text-gray-600">
                  <li>To provide and improve our services</li>
                  <li>To issue certificates and verify credentials</li>
                  <li>To communicate important updates</li>
                  <li>To ensure platform security and integrity</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Data Security</h2>
                <p className="text-gray-600">We use industry-standard security measures to protect your data. All sensitive information is encrypted and access is restricted to authorized personnel only.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Your Rights</h2>
                <ul className="list-disc ml-6 text-gray-600">
                  <li>Access, update, or delete your data at any time</li>
                  <li>Request a copy of your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Contact Us</h2>
                <p className="text-gray-600">If you have questions about this policy, email us at <a href="mailto:support@certifiedskill.org" className="text-indigo-600 underline">support@certifiedskill.org</a>.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 