
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { getCategoryLessons } from '../../../lib/lessonService';
import { Play, Award, CheckCircle, BookOpen } from 'lucide-react';
import SeoHead from '../../../components/SeoHead';

export default function CourseLanding({ category, lessons, firstLessonSlug }) {
  const meta = {
     capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
     title: `${category.charAt(0).toUpperCase() + category.slice(1)} Certification Course`,
     desc: `Master ${category} with our comprehensive, free interactive course. Pass the exam to earn your industry-recognized certificate.`
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <SeoHead 
        title={meta.title}
        description={meta.desc}
      />
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
         {/* Hero */}
         <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-slate-100">
            <div className="md:flex">
                <div className="p-10 md:p-16 flex-1 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6 w-fit">
                        <Award size={16} />
                        <span>Official Certification Course</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Become a <span className="text-indigo-600 capitalize">{category}</span> Developer
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        {meta.desc} Includes interactive examples, quizzes, and a verifiable digital certificate upon completion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/learn/${category}/${firstLessonSlug}`} className="inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1">
                            <Play size={20} fill="currentColor" />
                            Start Learning
                        </Link>
                        <Link href={`/exam/${category}`} className="inline-flex justify-center items-center gap-2 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 font-bold py-4 px-8 rounded-xl transition">
                            <Award size={20} />
                            Take Certification Exam
                        </Link>
                    </div>
                </div>
                <div className="bg-indigo-900/5 md:w-1/3 flex items-center justify-center p-10">
                     {/* Dynamic Icon/Graphic based on category could go here */}
                     <div className="text-9xl font-black text-indigo-900/10 select-none uppercase tracking-tighter">
                        {category}
                     </div>
                </div>
            </div>
         </div>

         {/* Syllabus / Lessons */}
         <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BookOpen className="text-indigo-600" />
                    Course Syllabus
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                    {lessons.map((lesson, idx) => (
                        <Link href={`/learn/${category}/${lesson.slug}`} key={idx} className="flex items-center justify-between p-5 hover:bg-slate-50 transition group">
                            <div className="flex items-center gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-mono text-sm flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {idx + 1}
                                </span>
                                <span className="font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                                    {lesson.title}
                                </span>
                            </div>
                            <div className="text-slate-300 group-hover:translate-x-1 transition-transform">
                                &rarr;
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* Sidebar Stats */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Award />
                        Certificate of Completion
                    </h3>
                    <p className="text-indigo-100 text-sm mb-6">
                        Pass the exam with 70% or higher to earn your official, verifiable certificate.
                    </p>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                         <div className="flex justify-between text-sm mb-2">
                            <span>Exam Duration</span>
                            <span className="font-bold">30 Mins</span>
                         </div>
                         <div className="flex justify-between text-sm mb-2">
                            <span>Questions</span>
                            <span className="font-bold">20-30</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span>Passing Score</span>
                            <span className="font-bold">70%</span>
                         </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Why learn {category}?</h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <span>High demand in the job market</span>
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600">
                             <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <span>Core technology for web development</span>
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600">
                             <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <span>Foundation for advanced frameworks</span>
                        </li>
                    </ul>
                </div>
            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps({ params }) {
   const { category } = params;
   const lessons = await getCategoryLessons(category);
   
   if (lessons.length > 0) {
       let first = lessons.find(l => l.slug === 'introduction' || l.slug === 'default');
       if (!first) first = lessons[0];
       
       return {
           props: {
               lessons,
               firstLessonSlug: first.slug,
               category
           }
       }
   }
   
   return {
       notFound: true
   }
}
