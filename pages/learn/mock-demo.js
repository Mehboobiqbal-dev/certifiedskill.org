
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LessonView from '../../components/LessonView';
import { BookOpen, CheckCircle, Menu } from 'lucide-react';

const MOCK_LESSON = {
  title: "HTML Tutorial",
  category: "html",
  content: `HTML
Tutorial
Learn HTML
HTML is the standard markup language for Web pages.
With HTML you can create your own Website.
HTML is easy to learn - You will enjoy it!

HTML Tutorial
Study our HTML Tutorial for free,
no registration needed.

Example
<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
Try it Yourself »

HTML Examples
This tutorial supplements all explanations with clarifying examples.
See all HTML Examples
`
};

export default function LessonPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <div className="flex flex-1 relative">
        {/* Sidebar Trigger (Mobile) */}
        {!sidebarOpen && (
             <button 
             onClick={() => setSidebarOpen(true)}
             className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl md:hidden"
           >
             <Menu />
           </button>
        )}
     
        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:static md:h-auto md:w-80
          `}
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
              <BookOpen size={24} />
              <span>HTML Course</span>
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">Close</button>
          </div>
          
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-indigo-200">
            {['Introduction', 'Editors', 'Basic', 'Elements', 'Attributes', 'Headings', 'Paragraphs', 'Styles', 'Formatting', 'Quotations', 'Comments', 'Colors', 'CSS', 'Links', 'Images', 'Tables'].map((item, i) => (
              <a 
                key={i} 
                href="#" 
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${i === 2 ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
                `}
              >
                <span>{item}</span>
                {i < 2 && <CheckCircle size={14} className="text-emerald-500" />}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
           {/* Breadcrumb / Top Bar */}
           <div className="mb-8 flex items-center text-sm text-slate-500">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="capitalize">{MOCK_LESSON.category}</span>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-semibold">{MOCK_LESSON.title}</span>
           </div>

           <LessonView 
             title={MOCK_LESSON.title}
             content={MOCK_LESSON.content}
           />

           <div className="mt-12 flex justify-between max-w-4xl mx-auto">
              <button className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition shadow-sm">
                 &larr; Previous
              </button>
              <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-0.5">
                 Next Lesson &rarr;
              </button>
           </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
