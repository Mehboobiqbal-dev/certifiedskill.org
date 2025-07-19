"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaArrowRight, FaArrowLeft, FaListAlt } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';

export default function ExamStart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId") || "";

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    axios.get(`/api/exam/questions?examId=${examId}`)
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [examId]);

  const handleOption = (qid, option) => {
    setAnswers(a => ({ ...a, [qid]: option }));
  };
  const handlePrev = () => setCurrent(c => Math.max(0, c - 1));
  const handleNext = () => setCurrent(c => Math.min(questions.length - 1, c + 1));
  const handleSummary = () => setShowSummary(true);
  const handleBackToQuestions = () => setShowSummary(false);
  const handleSubmit = () => {
    setSubmitted(true);
    setShowSummary(false);
    setScore(Math.floor(Math.random() * (questions.length + 1)));
  };

  // Progress percentage
  const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center py-0 px-0">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-indigo-100 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-2">
          <span className="text-xs text-gray-500">Question {current + 1} of {questions.length}</span>
          <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-200 py-10 px-4 text-center relative">
        <div className="absolute inset-0 bg-[url('/exam-bg.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2">{examId ? `Start ${examId.toUpperCase()} Exam` : "Start Exam"}</h1>
        <p className="text-lg text-indigo-100 max-w-2xl mx-auto">Answer all questions to the best of your ability. Good luck!</p>
      </section>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 mt-[-3rem] z-10 relative">
        {loading ? (
          <>
            <Skeleton height={32} width={320} className="mb-6 mx-auto" />
            <Skeleton height={18} width={120} />
            <Skeleton height={8} width={128} />
            <Skeleton count={4} height={24} className="mb-3" />
            <Skeleton height={44} width={160} />
          </>
        ) : questions.length > 0 ? (
          <>
            {/* Question Card or Summary */}
            {!showSummary ? (
              <>
                <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 mb-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-indigo-600 font-bold text-lg">{current + 1}.</span>
                    <span className="font-semibold text-gray-900 text-lg">{questions[current].text}</span>
                  </div>
                  <div className="grid gap-4 mt-6">
                    {questions[current].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOption(questions[current]._id, option)}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all text-lg font-medium shadow-sm
                          ${answers[questions[current]._id] === option
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-700 scale-105'
                            : 'border-gray-200 hover:bg-indigo-50'}
                        `}
                        aria-pressed={answers[questions[current]._id] === option}
                      >
                        <span className="flex-1 text-left">{option}</span>
                        {answers[questions[current]._id] === option && (
                          <span className="text-green-600"><FaCheckCircle /></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                  <button
                    onClick={handlePrev}
                    disabled={current === 0}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaArrowLeft /> Previous
                  </button>
                  <div className="flex gap-2">
                    {current < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                      >
                        Next <FaArrowRight />
                      </button>
                    ) : (
                      <button
                        onClick={handleSummary}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                      >
                        <FaListAlt /> Review & Submit
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Summary Step
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2"><FaListAlt /> Review Your Answers</h2>
                <ul className="mb-6 space-y-2">
                  {questions.map((q, idx) => (
                    <li key={q._id} className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">{idx + 1}.</span>
                      <span className="flex-1">{q.text}</span>
                      <span className="ml-auto px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {answers[q._id] || <span className="text-gray-400">No answer</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <button
                    onClick={handleBackToQuestions}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                  >
                    <FaArrowLeft /> Back to Questions
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-8 rounded-lg shadow transition flex items-center gap-2"
                  >
                    <FaCheckCircle /> Submit Exam
                  </button>
                </div>
              </div>
            )}
          </>
        ) : submitted ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <FaCheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Exam Submitted!</h2>
            <p className="text-lg text-gray-700 mb-4">Your score: <span className="font-bold">{score} / {questions.length}</span></p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-8 rounded-lg shadow transition mt-4"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-red-500 text-center">No questions found for this exam.</div>
        )}
      </div>
    </main>
  );
}
