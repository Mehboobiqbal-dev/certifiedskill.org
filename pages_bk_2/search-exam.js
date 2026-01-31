// pages/search-exam.js
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SearchExamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);

  // Fetch exams from your API on component mount.
  useEffect(() => {
    fetch("/api/exams")
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error("Error fetching exams:", err));
  }, []);

  // Always update filteredExams based on exams and searchQuery.
  useEffect(() => {
    const queryLower = searchQuery.toLowerCase();
    if (queryLower === "") {
      // When there's no query, show all exams
      setFilteredExams(exams);
    } else {
      const results = exams.filter((exam) => {
        // Safely convert exam properties to lowercase for comparison
        const examTitle = (exam.title || "").toLowerCase();
        const examCategory = (exam.category || "").toLowerCase();
        return examTitle.includes(queryLower) || examCategory.includes(queryLower);
      });
      setFilteredExams(results);
    }
  }, [searchQuery, exams]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Search Exams</h1>
        <input
          type="text"
          placeholder="Search for an exam..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-6">
          {filteredExams && filteredExams.length > 0 ? (
            <ul>
              {filteredExams.map((exam) => (
                <li key={exam._id} className="mb-4 border p-4 rounded-lg shadow">
                  <Link
                    href={`/exam/${exam._id}`}
                    className="text-lg font-medium text-indigo-600 hover:underline"
                  >
                    {exam.title}
                  </Link>
                  <p className="text-sm text-gray-500">{exam.category}</p>
                  <p className="text-sm text-gray-500">Difficulty: {exam.difficulty}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">
              {searchQuery ? "No exams found." : "No exams available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
