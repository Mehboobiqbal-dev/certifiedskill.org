"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from 'react-loading-skeleton';

export default function ExamStart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId") || "";

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!examId) return;
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/exam/questions?examId=${examId}`);
        setQuestions(res.data.questions);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to fetch questions");
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [examId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">{examId ? `Start ${examId.toUpperCase()} Exam` : "Start Exam"}</h1>
        {loading ? (
          <>
            <Skeleton height={32} width={320} className="mb-6 mx-auto" />
            <div className="mb-6 flex items-center justify-between">
              <Skeleton height={18} width={120} />
              <Skeleton height={8} width={128} />
            </div>
            <ul className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <li key={i} className="bg-indigo-50 rounded-xl p-6 shadow border border-indigo-100">
                  <Skeleton height={24} width={280} className="mb-3" />
                  <Skeleton count={4} height={18} width={200} style={{ marginBottom: 8 }} />
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-end">
              <Skeleton height={44} width={160} />
            </div>
          </>
        ) : questions.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Questions: {questions.length}</span>
              {/* Progress bar placeholder */}
              <div className="w-32 h-2 bg-indigo-100 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: "0%" }} />
              </div>
            </div>
            <ul className="space-y-8">
            {questions.map((q, index) => (
                <li key={q._id} className="bg-indigo-50 rounded-xl p-6 shadow border border-indigo-100">
                  <p className="font-semibold text-lg text-gray-900 mb-3">{index + 1}. {q.text}</p>
                  <ul className="space-y-2">
                  {q.options.map((option, idx) => (
                    <li key={idx}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={`q-${q._id}`} value={option} className="accent-indigo-600" />
                          <span className="text-gray-700">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
            <div className="mt-10 flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-lg shadow transition">Submit Exam</button>
        </div>
          </>
      ) : (
          <div className="text-red-500 text-center">No questions found for this exam.</div>
      )}
    </div>
    </main>
  );
}
