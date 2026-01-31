
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getAllCategories } from '../../lib/lessonService';
import { BookOpen, Code, Terminal, Database, Server, Globe, Cpu, Hash } from 'lucide-react';
import SeoHead from '../../components/SeoHead';

// Heuristic to map icons/colors to categories
const GET_META = (cat) => {
  switch (cat) {
    case 'html': return { icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' };
    case 'css': return { icon: Code, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
    case 'js': 
    case 'javascript': return { icon: Terminal, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100' };
    case 'python': return { icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    case 'sql': return { icon: Database, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' };
    case 'java': return { icon: Code, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' };
    default: return { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' };
  }
};

export default function LearnIndex({ categories }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <SeoHead 
        title="Browse Courses - CertifiedSkill.org"
        description="Explore our extensive library of free programming courses. Learn HTML, CSS, JavaScript, Python, SQL, and more with interactive examples."
      />
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Unlock Your <span className="text-indigo-600">Coding Potential</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose from hundreds of free, interactive courses designed to take you from beginner to certified professional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
             const meta = GET_META(cat);
             const Icon = meta.icon;
             
             return (
               <Link href={`/learn/${cat}`} key={cat} className="group">
                 <div className={`
                    h-full p-8 rounded-3xl bg-white border ${meta.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                    flex flex-col items-start
                 `}>
                    <div className={`p-4 rounded-2xl ${meta.bg} mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon size={32} className={meta.color} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 capitalize group-hover:text-indigo-600 transition-colors">
                      {cat.replace(/-/g, ' ')}
                    </h3>
                    <p className="text-slate-500 mb-6 flex-1">
                      Master the fundamentals and advanced concepts of {cat.replace(/-/g, ' ')}.
                    </p>
                    <div className="w-full flex items-center text-sm font-semibold text-indigo-600 bg-indigo-50 py-3 px-4 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       Start Learning &rarr;
                    </div>
                 </div>
               </Link>
             );
          })}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const categories = await getAllCategories();
  
  // Sort important ones first
  const priority = ['html', 'css', 'js', 'python', 'sql', 'java', 'react', 'nodejs'];
  const sorted = categories.sort((a, b) => {
    const ai = priority.indexOf(a);
    const bi = priority.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return {
    props: {
      categories: sorted.slice(0, 50), // Verify performance, maybe slice
    },
    revalidate: 3600, // Rebuild every hour
  };
}
