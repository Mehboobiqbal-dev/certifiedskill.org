import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

export default function CookiePolicy() {
  return (
    <>
      <SeoHead
        title="Cookie Policy | CertifiedSkill.org"
        description="Learn how CertifiedSkill.org uses cookies and how you can control your preferences."
        canonical="https://certifiedskill.org/cookie-policy"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-3xl mx-auto p-8">
          <section className="my-12">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Cookie Policy</h1>
            <p className="text-gray-700 mb-6">This policy explains how CertifiedSkill.org uses cookies and similar technologies to enhance your experience.</p>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">What Are Cookies?</h2>
                <p className="text-gray-600">Cookies are small text files stored on your device by your browser. They help us remember your preferences and improve your experience.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Types of Cookies We Use</h2>
                <ul className="list-disc ml-6 text-gray-600">
                  <li><strong>Essential:</strong> Required for basic site functionality</li>
                  <li><strong>Analytics:</strong> Help us understand how users interact with our site</li>
                  <li><strong>Preferences:</strong> Remember your settings and choices</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">How to Control Cookies</h2>
                <p className="text-gray-600">You can manage your cookie preferences in your browser settings. Most browsers allow you to block or delete cookies, but this may affect site functionality.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Contact Us</h2>
                <p className="text-gray-600">Questions? Email us at <a href="mailto:support@certifiedskill.org" className="text-indigo-600 underline">support@certifiedskill.org</a>.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 