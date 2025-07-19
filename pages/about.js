import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Us | CertifiedSkill.org"
        description="Learn about CertifiedSkill.org's mission, vision, and commitment to free, world-class certification."
        canonical="https://certifiedskill.org/about"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-4xl mx-auto p-8">
          <section className="my-12 text-center">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">About CertifiedSkill.org</h1>
            <p className="text-lg text-gray-700 mb-6">Empowering everyone to prove their skills and advance their careers—100% free, forever.</p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">Our Mission</h2>
                <p className="text-gray-600">To democratize access to professional certification and make skill validation available to all, regardless of background or resources.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">Our Vision</h2>
                <p className="text-gray-600">A world where anyone can prove their expertise and unlock new opportunities, with credentials that are trusted by employers globally.</p>
              </div>
            </div>
            <div className="mt-12 flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="flex flex-col items-center">
                <img src="/press-logo1.png" alt="Press Logo 1" className="h-10 mb-2" />
                <span className="text-xs text-gray-500">As seen on</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/press-logo2.png" alt="Press Logo 2" className="h-10 mb-2" />
                <span className="text-xs text-gray-500">Trusted by</span>
              </div>
              {/* TODO: Add more trust signals, testimonials, and partner logos */}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 