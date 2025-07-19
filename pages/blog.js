import SeoHead from "../components/SeoHead";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";

const BLOG_POSTS = [
  {
    slug: "why-certification-matters",
    title: "Why Certification Matters in 2024",
    excerpt: "Discover why industry-recognized certifications are more important than ever for career growth.",
    date: "2024-06-01",
    author: "Mehboob Iqbal",
    image: "/blog-certification.jpg",
  },
  {
    slug: "free-vs-paid-certifications",
    title: "Free vs. Paid Certifications: What You Need to Know",
    excerpt: "A deep dive into the pros and cons of free and paid certification programs.",
    date: "2024-05-20",
    author: "Mehboob Iqbal",
    image: "/blog-free-vs-paid.jpg",
  },
  // TODO: Load posts dynamically from backend or markdown
];

export default function BlogIndex() {
  return (
    <>
      <SeoHead
        title="Blog & Resources | CertifiedSkill.org"
        description="Read expert articles, guides, and tips on certification, career growth, and online exams."
        canonical="https://certifiedskill.org/blog"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <section className="w-full bg-gradient-to-r from-indigo-600 to-blue-400 py-16 px-4 text-center flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('/blog-hero.svg')] bg-no-repeat bg-center bg-contain opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">Blog & Resources</h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-6">
              Insights, tips, and news about certification, exams, and career growth.
            </p>
          </div>
        </section>
        <main className="max-w-5xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col overflow-hidden">
                <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-indigo-700 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* TODO: Pagination, categories, and dynamic content */}
        </main>
        <Footer />
      </div>
    </>
  );
} 