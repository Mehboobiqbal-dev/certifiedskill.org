"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ExamStart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId") || "";

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!examId) return;

    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/api/exam/questions?examId=${examId}`);
        setQuestions(res.data.questions);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to fetch questions");
      }
    };

    fetchQuestions();
  }, [examId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Start {examId.toUpperCase()} Exam</h1>
      
      {questions.length > 0 ? (
        <div className="w-full max-w-2xl bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Exam Questions</h2>
          <ul>
            {questions.map((q, index) => (
              <li key={q._id} className="mb-4">
                <p className="font-medium">{index + 1}. {q.text}</p>
                <ul className="ml-4">
                  {q.options.map((option, idx) => (
                    <li key={idx}>
                      <label className="flex items-center">
                        <input type="radio" name={`q-${q._id}`} value={option} className="mr-2" />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-red-500">No questions found for this exam.</p>
      )}
    </div>
  );
}
