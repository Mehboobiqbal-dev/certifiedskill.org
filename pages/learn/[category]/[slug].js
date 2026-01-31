
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LessonView from '../../../components/LessonView';
import { getLesson, getCategoryLessons } from '../../../lib/lessonService';
import { BookOpen, CheckCircle, Menu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Lesson({ lesson, relatedLessons }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (router.isFallback) {
    return <div className="p-8 text-center text-xl">Loading lesson content...</div>;
  }

  if (!lesson) {
    return <div className="p-8 text-center text-red-500">Lesson not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <div className="flex flex-1 relative">
         {/* Mobile Toggle */}
         <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl md:hidden hover:bg-indigo-700 transition"
           >
             <Menu />
        </button>

        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:static md:h-auto md:w-80
          `}
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold flex items-center gap-3 text-indigo-700">
              <BookOpen size={24} className="text-indigo-600"/>
              <span className="capitalize">{lesson.category} Tutorial</span>
            </h2>
          </div>
          
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-indigo-100 hover:scrollbar-thumb-indigo-200">
            {relatedLessons.map((l, i) => (
              <Link 
                key={i} 
                href={`/learn/${lesson.category}/${l.slug}`}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group
                  ${l.slug === lesson.slug 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:pl-6'}
                `}
              >
                <span className="truncate pr-2">{l.title.replace(' Tutorial', '').replace(lesson.category.toUpperCase(), '')}</span>
                {l.slug === lesson.slug && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:px-10 md:py-10">
           {/* Breadcrumb */}
           <div className="mb-8 flex flex-wrap items-center text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm w-fit">
              <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
              <ChevronRight size={14} className="mx-2 text-slate-300" />
              <span className="capitalize text-slate-400">Learn</span>
              <ChevronRight size={14} className="mx-2 text-slate-300" />
              <Link href={`/learn/${lesson.category}`} className="capitalize hover:text-indigo-600 transition">{lesson.category}</Link>
              <ChevronRight size={14} className="mx-2 text-slate-300" />
              <span className="text-indigo-600 font-semibold truncate max-w-[200px]">{lesson.title}</span>
           </div>

           <LessonView 
             title={lesson.title}
             content={lesson.content}
           />

           <div className="mt-16 flex justify-between items-center pt-8 border-t border-slate-200">
              <button className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition shadow-sm hover:shadow-md flex items-center gap-2">
                 <ChevronRight className="rotate-180" size={18}/> Previous
              </button>
              <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2">
                 Next Lesson <ChevronRight size={18}/>
              </button>
           </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { category, slug } = params;
  
  const lesson = await getLesson(category, slug);
  const relatedLessons = await getCategoryLessons(category);

  if (!lesson) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lesson,
      relatedLessons,
    },
  };
}
