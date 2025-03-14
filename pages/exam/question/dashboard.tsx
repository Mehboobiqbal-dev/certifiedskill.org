"use client";

import { useRouter } from "next/navigation";

const exams = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "frontend", name: "Frontend Development" },
  { id: "nodejs", name: "Node.js" },
  { id: "react", name: "React.js" },
  { id: "angular", name: "Angular" },
  { id: "vue", name: "Vue.js" },
  { id: "mongodb", name: "MongoDB" },
  { id: "mysql", name: "MySQL" },
  { id: "aws", name: "AWS Cloud" },
  { id: "devops", name: "DevOps" },
  { id: "cybersecurity", name: "Cyber Security" },
  { id: "datascience", name: "Data Science" },
  { id: "blockchain", name: "Blockchain" },
];

export default function ExamDashboard() {
  const router = useRouter();

  const startExam = (examId: string) => {
    router.push(`/exam/start?examId=${examId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">📚 Choose Your Exam</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
        {exams.map((exam) => (
          <button
            key={exam.id}
            onClick={() => startExam(exam.id)}
            className="p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {exam.name}
          </button>
        ))}
      </div>
    </div>
  );
}
