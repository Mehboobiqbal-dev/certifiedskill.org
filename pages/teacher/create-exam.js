import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateExam() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questionsJSON, setQuestionsJSON] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    let questions = [];
    try {
      questions = JSON.parse(questionsJSON);
      if (!Array.isArray(questions)) {
        throw new Error("JSON must be an array of questions.");
      }
      if (questions.length !== 60) {
        throw new Error("Please include exactly 60 questions.");
      }
    } catch (err) {
      setErrorMessage("Invalid JSON: " + err.message);
      return;
    }

    const examData = {
      title,
      questions,
      duration: 60, // 1 hour duration
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000)
    };

    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });

    if (res.ok) {
      alert('Exam created successfully');
      router.push('/dashboard');
    } else {
      alert('Error creating exam');
    }
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
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
