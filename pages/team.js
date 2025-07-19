import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";

const TEAM = [
  {
    name: "Mehboob Iqbal",
    role: "Founder & CEO",
    image: "https://randomuser.me/api/portraits/men/11.jpg", // You can replace with a real photo if available
    linkedin: "https://www.linkedin.com/in/mehboob-iqbal-3b1263190",
  },
];

export default function TeamPage() {
  return (
    <>
      <SeoHead
        title="Our Team | CertifiedSkill.org"
        description="Meet the founder and CEO of CertifiedSkill.org."
        canonical="https://certifiedskill.org/team"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="max-w-4xl mx-auto p-8">
          <section className="my-12 text-center">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">Meet Our Founder</h1>
            <p className="text-lg text-gray-700 mb-8">Visionary leadership dedicated to democratizing certification.</p>
            <div className="flex flex-col items-center justify-center">
              {TEAM.map((member) => (
                <div key={member.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center max-w-sm mx-auto">
                  <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full border-4 border-indigo-200 shadow mb-4" />
                  <div className="text-2xl font-bold text-gray-800">{member.name}</div>
                  <div className="text-indigo-600 font-medium mb-2">{member.role}</div>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline text-sm">LinkedIn</a>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
} 