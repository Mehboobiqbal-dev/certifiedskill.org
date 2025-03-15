import { FaceDetection } from '@mediapipe/face_detection';
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
        // Face not detected: flag cheating and notify parent component.
        setIsCheating(true);
        onCheatingDetected();
      } else {
        setIsCheating(false);
      }
    });

    // Function to load Camera Utils from CDN dynamically
    const loadCameraUtilsScript = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById('mediapipe-camera-utils')) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
          script.id = 'mediapipe-camera-utils';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error('Failed to load Camera Utils script.'));
          document.body.appendChild(script);
        }
      });
    };

    let cameraInstance;
    loadCameraUtilsScript()
      .then(() => {
        // Now, window.Camera should be available if the script loads successfully.
        if (videoRef.current && window.Camera) {
          cameraInstance = new window.Camera(videoRef.current, {
            onFrame: async () => {
              await faceDetection.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
          });
          cameraInstance.start();
        }
      })
      .catch((error) => console.error(error));

    return () => {
      if (cameraInstance && cameraInstance.stop) {
        cameraInstance.stop();
      }
    };
  }, [onCheatingDetected]);

  return (
    <div>
      {/* Hidden video element for Mediapipe processing */}
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
  // State for storing user answers: key is question index
  const [userAnswers, setUserAnswers] = useState({});
  // Flag if exam has been submitted
  const [submitted, setSubmitted] = useState(false);
  // Timer: 40 minutes = 2400 seconds
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  // State to track the count of cheating detections
  const [cheatingCount, setCheatingCount] = useState(0);
  // State for computed time taken (in seconds) after submission
  const [timeTaken, setTimeTaken] = useState(null);

  // Timer effect: decrement every second until submission or time expires
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
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

  // Submission handler: calculates score, determines pass/fail,
  // saves the result to MongoDB, and stops further input.
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (submitted) return;
    setSubmitted(true);

    // Calculate correct answer count.
    const correctCount = exam.questions.reduce((count, question, index) => {
      return userAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);

    const total = exam.questions.length;
    const passingScore = 40; // Example passing score threshold.
    const passed = correctCount >= passingScore;
    const computedTimeTaken = (40 * 60) - timeLeft;
    setTimeTaken(computedTimeTaken);

    const resultData = {
      examId: exam._id,
      score: correctCount,
      total,
      passed,
      timeTaken: computedTimeTaken,
      cheatingCount, // Number of times cheating was detected.
      createdAt: new Date(),
    };

    // Save the result to MongoDB via POST request.
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
    setCheatingCount((prev) => prev + 1);
  };

  // Helper to apply styles to options after submission.
  const getOptionClass = (question, option, questionIndex) => {
    if (!submitted) return 'cursor-pointer';
    if (option === question.correctAnswer) return 'bg-green-100';
    if (userAnswers[questionIndex] === option && option !== question.correctAnswer)
      return 'bg-red-100';
    return '';
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Recalculate correct answers for displaying the score.
  const correctCountForDisplay = exam.questions.reduce((count, question, index) => {
    return userAnswers[index] === question.correctAnswer ? count + 1 : count;
  }, 0);

  return (
    <div className="relative">
      {/* Anti-Cheating component */}
      <AntiCheating onCheatingDetected={handleCheatingDetected} />

      {/* Fixed timer in the top-right corner */}
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
                {correctCountForDisplay >= passingScore
                  ? 'Congratulations! You have passed the exam.'
                  : 'Sorry, you did not pass the exam.'}
              </p>
              {timeTaken !== null && (
                <p className="text-lg">
                  Time Taken: {Math.floor(timeTaken / 60)} minutes {timeTaken % 60} seconds.
                </p>
              )}
              <p className="text-lg">Cheating Attempts: {cheatingCount}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params, req }) {
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
