import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

const TESTIMONIALS = [
  {
    name: "Ravi P.",
    title: "Software Developer",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "CertifiedSkill.org helped me land my dream job! The free certification was recognized by my employer.",
    rating: 5,
  },
  {
    name: "Sara T.",
    title: "Data Analyst",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "The exam experience was smooth and professional. Highly recommend to anyone looking to prove their skills.",
    rating: 5,
  },
  // TODO: Add more testimonials
];

export default function TestimonialsPage() {
  return (
    <>
      <SeoHead
        title="Testimonials | CertifiedSkill.org"
        description="See what users and employers say about CertifiedSkill.org."
        canonical="https://certifiedskill.org/testimonials"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-4xl mx-auto p-8">
          <section className="my-12 text-center">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">What Our Users Say</h1>
            <p className="text-lg text-gray-700 mb-8">Real stories from certified professionals and hiring managers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                  <img src={t.image} alt={t.name} className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow mb-4" />
                  <div className="flex gap-1 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <div className="text-lg font-bold text-gray-800">{t.name}</div>
                  <div className="text-indigo-600 font-medium mb-2">{t.title}</div>
                  <p className="text-gray-600 text-base">{t.text}</p>
                </div>
              ))}
            </div>
            {/* TODO: Add more testimonials, company logos, and video testimonials */}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 