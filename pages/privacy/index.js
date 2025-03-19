// pages/privacy.js
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Privacy Policy - CertifySkill.org</title>
      </Head>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <section className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Last updated: 2025
          </p>
        </section>

        {/* Policy Sections */}
        <section className="mt-12 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
            <p className="mt-2 text-gray-600">
              Welcome to CertifySkill.org ("we", "us", "our"). Your privacy is extremely important to us. This Privacy Policy describes how we collect, use, and protect your information when you access our website and services.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              Information We Collect
            </h2>
            <p className="mt-2 text-gray-600">
              We collect personally identifiable information ("Personal Information") that you voluntarily provide when you register for our services, such as your name, email address, and any other information you choose to share.
            </p>
            <p className="mt-2 text-gray-600">
              In addition, we may automatically collect non-personal data (e.g., browser type, IP address, time spent on the site) for analytics and improving our services.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              How We Use Your Information
            </h2>
            <p className="mt-2 text-gray-600">
              We use your data to provide, maintain, and enhance our services. This includes processing transactions, user account management, and improving the overall user experience.
            </p>
            <p className="mt-2 text-gray-600">
              <strong>Importantly, we do not share or sell your Personal Information with third parties for their marketing purposes.</strong> Any data sharing is strictly limited to trusted service providers who help us operate our platform and is governed by strict confidentiality agreements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              Data Security
            </h2>
            <p className="mt-2 text-gray-600">
              We implement technical, administrative, and physical safeguards to protect your data. While we strive to secure your information, no method is 100% foolproof. By using our services, you acknowledge that we cannot guarantee absolute security.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Rights and Choices
            </h2>
            <p className="mt-2 text-gray-600">
              Depending on your location, you may have rights regarding your Personal Information, including the right to access, update, or delete your data. If you wish to exercise these rights, please contact us at 
              <a href="mailto:privacy@CertifySkill.org.com" className="text-blue-600 hover:underline ml-1">
                privacy@CertifySkill.org.com
              </a>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              International Data Transfers
            </h2>
            <p className="mt-2 text-gray-600">
              Your information may be transferred and processed in countries other than your own. We ensure that such transfers are secure and conducted in accordance with this Privacy Policy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              Changes to This Privacy Policy
            </h2>
            <p className="mt-2 text-gray-600">
              We may update this Privacy Policy from time to time. Changes will be posted on this page along with the updated effective date. Please review this policy periodically to stay informed about how we are protecting your information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800">
              Contact Us
            </h2>
            <p className="mt-2 text-gray-600">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-gray-600">
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@CertifySkill.org.com" className="text-blue-600 hover:underline">
                privacy@CertifySkill.org.com
              </a>
            </p>
           
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} CertifySkill.org. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
