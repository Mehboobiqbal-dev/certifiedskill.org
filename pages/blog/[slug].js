import { useRouter } from "next/router";
import SeoHead from "../../components/SeoHead";
import Header from "../Header";
import Footer from "../Footer";

// Sample static post data for demo
const BLOG_POSTS = {
  "why-certification-matters": {
    title: "Why Certification Matters in 2024",
    excerpt: "Discover why industry-recognized certifications are more important than ever for career growth.",
    date: "2024-06-01",
    author: "Mehboob Iqbal",
    image: "/blog-certification.jpg",
    content: `\
      <p>In today's fast-changing job market, certifications are a powerful way to prove your skills and stand out. Employers trust industry-recognized credentials, and candidates with certifications often earn more and get hired faster.</p>
      <h2>Benefits of Certification</h2>
      <ul>
        <li>Demonstrates verified expertise</li>
        <li>Boosts your resume and LinkedIn profile</li>
        <li>Opens doors to new opportunities</li>
      </ul>
      <p>CertifiedSkill.org makes it easy and free to get certified. Start your journey today!</p>
    `,
  },
  "free-vs-paid-certifications": {
    title: "Free vs. Paid Certifications: What You Need to Know",
    excerpt: "A deep dive into the pros and cons of free and paid certification programs.",
    date: "2024-05-20",
    author: "Mehboob Iqbal",
    image: "/blog-free-vs-paid.jpg",
    content: `\
      <p>There are more certification options than ever. Should you pay, or are free programs just as good?</p>
      <h2>Free Certifications</h2>
      <ul>
        <li>Accessible to everyone</li>
        <li>No financial risk</li>
        <li>Great for self-starters</li>
      </ul>
      <h2>Paid Certifications</h2>
      <ul>
        <li>May offer more support/resources</li>
        <li>Sometimes required by employers</li>
        <li>Can be expensive</li>
      </ul>
      <p>CertifiedSkill.org offers free, high-quality certifications recognized by employers worldwide.</p>
    `,
  },
};

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <main className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Post Not Found</h1>
          <p className="text-gray-600">Sorry, the blog post you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={`${post.title} | CertifiedSkill.org Blog`}
        description={post.excerpt}
        canonical={`https://certifiedskill.org/blog/${slug}`}
        image={post.image}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <main className="max-w-2xl mx-auto p-8">
          <img src={post.image} alt={post.title} className="w-full h-56 object-cover rounded-xl shadow mb-6" />
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
            <span>By {post.author}</span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <article className="prose prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </main>
        <Footer />
      </div>
    </>
  );
} 