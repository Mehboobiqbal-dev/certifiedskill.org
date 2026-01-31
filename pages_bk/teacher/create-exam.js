// pages/teacher/create-exam.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateExam() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questionsJSON, setQuestionsJSON] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    let questions = [];
    try {
      // Parse the input JSON string
      questions = JSON.parse(questionsJSON);

      // Validate that the parsed value is an array
      if (!Array.isArray(questions)) {
        throw new Error("JSON must be an array of questions.");
      }
      // Validate that there are exactly 60 questions.
      if (questions.length !== 60) {
        throw new Error(
          `Please include exactly 60 questions, but you provided ${questions.length}.`
        );
      }
    } catch (err) {
      // If there's an issue with parsing or validation, update the error message and stop processing.
      setErrorMessage("Invalid JSON: " + err.message);
      setLoading(false);
      return;
    }

    // Prepare the exam data record
    const examData = {
      title,
      questions,
      duration: 60, // Exam duration set to 60 minutes (1 hour)
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // endTime is 1 hour from now
    };

    try {
      // Post the exam data to your API
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData),
      });

      // Check the API response
      if (res.ok) {
        alert("Exam created successfully");
        router.push("/dashboard");
      } else {
        const errorResponse = await res.text();
        alert("Error creating exam: " + errorResponse);
      }
    } catch (error) {
      alert("Network error creating exam: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 shadow-md rounded-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Exam
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Exam Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Exam Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter exam title"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {/* Questions JSON Textarea */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Questions JSON (60 questions):
              </label>
              <textarea
                value={questionsJSON}
                onChange={(e) => setQuestionsJSON(e.target.value)}
                required
                rows="10"
                placeholder='[{"questionText": "Question 1", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}, ...]'
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Creating Exam..." : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
