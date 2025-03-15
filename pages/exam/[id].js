import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

function AntiCheating({ onCheatingDetected }) {
  const videoRef = useRef(null);
  const [isCheating, setIsCheating] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Face Detection
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results) => {
      if (!results.detections || results.detections.length === 0) {
        // Face not detected
        setIsCheating(true);
        onCheatingDetected();
      } else {
        // Face detected
        setIsCheating(false);
      }
    });

    // Set up the webcam
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceDetection.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
    };
  }, [onCheatingDetected]);

  return (
    <div>
      {/* Video Feed */}
      <video ref={videoRef} className="hidden"></video>
      {isCheating && (
        <div className="fixed top-4 left-4 bg-red-600 text-white px-4 py-2 rounded shadow-md">
          Warning: Cheating Detected!
        </div>
      )}
    </div>
  );
}

export default function Exam({ exam }) {
  // State to store the user's answers (using question index as key)
  const [userAnswers, setUserAnswers] = useState({});
  // State to know if the exam has been submitted
  const [submitted, setSubmitted] = useState(false);
  // Countdown timer: 40 minutes = 2400 seconds
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  // Cheating count
  const [cheatingCount, setCheatingCount] = useState(0);

  // Timer effect: decrease timeLeft by 1 every second until time expires or submission occurs
  useEffect(() => {
    if (submitted) return; // Stop timer if the exam is submitted

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
  };

  // Submission handler: calculates the score, determines pass/fail,
  // sends the result to MongoDB via a POST request, and sets the submitted flag.
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    // Prevent multiple submissions
    if (submitted) return;
    setSubmitted(true);

    // Calculate number of correct answers
    const correctCount = exam.questions.reduce((count, question, index) => {
      return userAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);

    const total = exam.questions.length;
    // Example passing criteria: user must score at least 40
    const passingScore = 40;
    const passed = correctCount >= passingScore;
    // Calculate time taken in seconds (Could be used later to display or store);
    const timeTaken = (40 * 60) - timeLeft;

    const resultData = {
      examId: exam._id,
      score: correctCount,
      total,
      passed,
      timeTaken,
      cheatingCount, // Number of cheating detections
      createdAt: new Date(),
    };

    // Send result to your API endpoint for MongoDB storage.
    try {
      await fetch('/api/exams/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
    } catch (error) {
      console.error('Failed to save exam result:', error);
    }
  };

  const handleCheatingDetected = () => {
    setCheatingCount((prev) => prev + 1); // Increment cheating count
  };

  // Helper function to conditionally style options after submission
  const getOptionClass = (question, option, questionIndex) => {
    if (!submitted) return 'cursor-pointer';
    // Highlight the correct answer with a green background
    if (option === question.correctAnswer) {
      return 'bg-green-100';
    }
    // If the user selected an incorrect option, highlight it in red
    if (userAnswers[questionIndex] === option && option !== question.correctAnswer) {
      return 'bg-red-100';
    }
    return '';
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // For display: recalculate correct count (once submitted)
  const correctCountForDisplay = exam.questions.reduce((count, question, index) => {
    return userAnswers[index] === question.correctAnswer ? count + 1 : count;
  }, 0);

  return (
    <div className="relative">
      {/* Anti-Cheating Component */}
      <AntiCheating onCheatingDetected={handleCheatingDetected} />

      {/* Timer */}
      {!submitted && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md">
          Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      )}

      <div className="p-6 max-w-3xl mx-auto">
        <Head>
          <title>{exam.title}</title>
        </Head>
        <h1 className="text-3xl font-bold mb-6">{exam.title}</h1>

        <form onSubmit={handleSubmit}>
          {exam.questions.map((q, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
            >
              <p className="text-lg font-medium mb-3">{q.questionText}</p>
              <div>
                {q.options.map((option, i) => (
                  <label
                    key={i}
                    className={`block p-2 mb-2 border rounded ${getOptionClass(q, option, index)}`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={userAnswers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      className="mr-2"
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {submitted && (
                <p className="mt-2">
                  {userAnswers[index] === q.correctAnswer ? (
                    <span className="text-green-600 font-semibold">Correct!</span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Incorrect. Correct answer: {q.correctAnswer}
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}

          {!submitted && (
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Submit Answers
            </button>
          )}

          {submitted && (
            <div className="mt-4">
              <p className="text-xl font-bold">
                You got {correctCountForDisplay} out of {exam.questions.length} correct!
              </p>
              <p className="text-lg">
                {correctCountForDisplay >= 40
                  ? 'Congratulations! You have passed the exam.'
                  : 'Sorry, you did not pass the exam.'}
              </p>
              <p className="text-lg">Time Taken: {Math.floor(timeTaken / 60)} minutes {timeTaken % 60} seconds.</p>
              <p className="text-lg">Cheating Attempts: {cheatingCount}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params, req }) {
  // Build the API URL dynamically based on the incoming request
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const apiUrl = `${protocol}://${host}/api/exams/${params.id}`;

  const res = await fetch(apiUrl);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('API error response:', errorText);
    return { notFound: true };
  }

  const exam = await res.json();
  return { props: { exam } };
}
