import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

export default function ContactPage() {
  return (
    <>
      <SeoHead
        title="Contact Us | CertifiedSkill.org"
        description="Contact CertifiedSkill.org for support, partnership, or press inquiries."
        canonical="https://certifiedskill.org/contact"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-2xl mx-auto p-8">
          <section className="my-12">
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">Contact Us</h1>
            <p className="text-gray-700 mb-6">Have a question, partnership inquiry, or need support? Fill out the form below or email us at <a href="mailto:support@certifiedskill.org" className="text-indigo-600 underline">support@certifiedskill.org</a>.</p>
            <form className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
              <input type="text" placeholder="Your Name" className="px-4 py-2 rounded border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
              <input type="email" placeholder="Your Email" className="px-4 py-2 rounded border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
              <textarea placeholder="Your Message" className="px-4 py-2 rounded border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400" rows={5} required />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-2 transition" disabled title="Coming soon!">Send Message</button>
            </form>
            <div className="mt-8 text-sm text-gray-500">
              <div>CertifiedSkill.org, Inc.</div>
              <div>123 Main Street, Suite 100, City, Country</div>
              <div>support@certifiedskill.org</div>
            </div>
            {/* TODO: Integrate backend for form submission */}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 