import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

export default function Accessibility() {
  return (
    <>
      <SeoHead
        title="Accessibility | CertifiedSkill.org"
        description="Learn about CertifiedSkill.org's commitment to accessibility and how we support all users."
        canonical="https://certifiedskill.org/accessibility"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-3xl mx-auto p-8">
          <section className="my-12">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Accessibility</h1>
            <p className="text-gray-700 mb-6">CertifiedSkill.org is committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability.</p>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Our Commitment</h2>
                <p className="text-gray-600">We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 AA standard. Our site is regularly tested for accessibility and usability.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Accessibility Features</h2>
                <ul className="list-disc ml-6 text-gray-600">
                  <li>Keyboard navigation for all interactive elements</li>
                  <li>Screen reader support and semantic HTML</li>
                  <li>High-contrast and dark mode options</li>
                  <li>Alt text for all images</li>
                  <li>Skip-to-content link</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Contact Us</h2>
                <p className="text-gray-600">If you encounter any accessibility barriers, please email <a href="mailto:support@certifiedskill.org" className="text-indigo-600 underline">support@certifiedskill.org</a>. We welcome your feedback and will address issues promptly.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-600 mb-2">Learn More</h2>
                <p className="text-gray-600">For more information, visit the <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">WCAG Guidelines</a>.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 