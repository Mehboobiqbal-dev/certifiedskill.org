"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ExamStart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [examId, setExamId] = useState(searchParams.get("examId") || "");
  const [loading, setLoading] = useState(false);

  const startExam = async () => {
    if (!examId) return alert("Exam ID is required");
    setLoading(true);
    try {
      const res = await axios.post("/api/exam/start", { examId });
      router.push(`/exam/question/${res.data.sessionId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Start {examId.toUpperCase()} Exam</h1>
      <button
        onClick={startExam}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Starting..." : "Start Exam"}
      </button>
    </div>
  );
}
