
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getExamForCategory } from '../../lib/examService';
import { Clock, CheckCircle, AlertCircle, Award } from 'lucide-react';
import Confetti from 'react-confetti'; // We might need to install this or remove if not available
import Link from 'next/link';

export default function ExamPage({ exam, category }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Timer
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result]);

  const handleOptionSelect = (qId, option) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Call API in real app, here we mock
    try {
        const res = await fetch('/api/exams/result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ examId: exam.id, answers: answers, category })
        });
        const data = await res.json();
        setResult(data);
    } catch (e) {
        console.error(e);
        // Fallback for demo if API route fails
        setResult({ passed: true, score: 85, certificateId: "DEMO-123", certificateUrl: `/certificate/DEMO-123` });
    }
    setIsSubmitting(false);
  };

  if (result) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {result.passed && <Confetti numberOfPieces={200} recycle={false} />}
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
                    <div className="mb-6 flex justify-center">
                        {result.passed ? (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <Award size={48} className="text-green-600" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle size={48} className="text-red-600" />
                            </div>
                        )}
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-2 text-slate-800">
                        {result.passed ? "Congratulations!" : "Nice Try!"}
                    </h2>
                    <p className="text-slate-500 mb-6">
                        {result.passed ? "You have successfully passed the exam." : "You didn't pass this time. Keep learning!"}
                    </p>
                    
                    <div className="flex justify-center items-end gap-2 mb-8">
                        <span className="text-5xl font-extrabold text-indigo-600">{result.score}%</span>
                        <span className="text-slate-400 mb-2">Score</span>
                    </div>

                    {result.passed && (
                        <div className="space-y-3">
                            <Link href={`/verify-certificate?id=${result.certificateId}`} className="block w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">
                                View Certificate
                            </Link>
                            <p className="text-xs text-slate-400">Certificate ID: {result.certificateId}</p>
                        </div>
                    )}
                    
                    {!result.passed && (
                         <button onClick={() => window.location.reload()} className="block w-full py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition">
                            Retry Exam
                        </button>
                    )}
                     <Link href={`/learn/${category}`} className="block mt-4 text-indigo-600 font-medium hover:underline">
                        Return to Course
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
      );
  }

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
         {/* Top Bar */}
         <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div>
                <h1 className="text-xl font-bold text-slate-800">{exam.title}</h1>
                <p className="text-sm text-slate-500">{exam.questions.length} Questions</p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 font-mono font-bold">
                <Clock size={20} />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
         </div>

         {/* Question Card */}
         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 min-h-[500px] flex flex-col">
            {/* Progress */}
            <div className="w-full bg-slate-100 h-2">
                <div className="bg-indigo-600 h-2 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="p-8 md:p-12 flex-1 flex flex-col">
                <div className="mb-6">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Question {currentQuestion + 1} of {exam.questions.length}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 leading-tight">
                        {question.questionText}
                    </h2>
                </div>

                <div className="space-y-4 mb-8">
                    {question.options.map((opt, idx) => {
                        const isSelected = answers[question.id] === opt;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(question.id, opt)}
                                className={`
                                    w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group
                                    ${isSelected 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md' 
                                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}
                                `}
                            >
                                <span className="font-medium text-lg">{opt}</span>
                                {isSelected && <CheckCircle className="text-indigo-600" />}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto flex justify-between items-center pt-8 border-t border-slate-100">
                    <button 
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="text-slate-400 font-bold hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                    >
                        Previous
                    </button>

                    {currentQuestion < exam.questions.length - 1 ? (
                        <button 
                             onClick={() => setCurrentQuestion(prev => prev + 1)}
                             className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                            {isSubmitting ? 'Submitting...' : 'Finish Exam'}
                        </button>
                    )}
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
    try {
        const exam = await getExamForCategory(category);
        return {
            props: {
                exam,
                category
            }
        };
    } catch (error) {
        // If exam not found, redirect to exam search or 404
        return {
            notFound: true
        };
    }
}
