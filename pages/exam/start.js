"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaArrowRight, FaArrowLeft, FaListAlt, FaExclamationTriangle, FaVideo, FaCamera } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
// Import face-api.js for webcam proctoring
// (Assume face-api.js is installed and available)
import * as faceapi from 'face-api.js';

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
  // Anti-cheating state
  const [cheatCount, setCheatCount] = useState(0);
  const [cheatReason, setCheatReason] = useState("");
  const [cheatWarning, setCheatWarning] = useState("");
  const [examCancelled, setExamCancelled] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const [faceLoaded, setFaceLoaded] = useState(false);
  const CHEAT_THRESHOLD = 3;
  const detectionInterval = useRef(null);

  // Load questions
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

  // Tab/window focus detection
  useEffect(() => {
    if (examCancelled) return;
    const handleBlur = () => {
      if (examCancelled) return;
      setCheatCount((c) => c + 1);
      setCheatReason("Tab/window switch detected");
      setCheatWarning("Switching tabs or windows is not allowed during the exam.");
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [examCancelled]);

  // Copy/paste/right-click prevention
  useEffect(() => {
    if (examCancelled) return;
    const prevent = (e) => e.preventDefault();
    document.addEventListener('copy', prevent);
    document.addEventListener('paste', prevent);
    document.addEventListener('contextmenu', prevent);
    return () => {
      document.removeEventListener('copy', prevent);
      document.removeEventListener('paste', prevent);
      document.removeEventListener('contextmenu', prevent);
    };
  }, [examCancelled]);

  // Full-screen enforcement
  useEffect(() => {
    if (examCancelled) return;
    const requestFullScreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    };
    requestFullScreen();
    const handleExit = () => {
      if (examCancelled) return;
      setCheatCount((c) => c + 1);
      setCheatReason("Exited full-screen mode");
      setCheatWarning("Exiting full-screen is not allowed during the exam.");
    };
    const fsHandler = () => {
      if (!document.fullscreenElement) handleExit();
    };
    document.addEventListener('fullscreenchange', fsHandler);
    return () => {
      document.removeEventListener('fullscreenchange', fsHandler);
    };
  }, [examCancelled]);

  // Webcam proctoring (face detection)
  useEffect(() => {
    if (examCancelled) return;
    let stream;
    let interval;
    let stopped = false;
    async function setupFaceApi() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        setFaceLoaded(true);
        if (videoRef.current) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setCameraReady(true);
            setCameraError("");
          } catch (err) {
            setCameraError("Camera access is required for proctoring. Please allow camera access and reload the page.");
            setCameraReady(false);
          }
        }
      } catch (err) {
        setCameraError("Failed to load face detection model.");
      }
    }
    setupFaceApi();
    interval = setInterval(async () => {
      if (stopped || !videoRef.current || !faceLoaded || !cameraReady || examCancelled) return;
      try {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
        if (!detections.length) {
          setCheatCount((c) => c + 1);
          setCheatReason("No face detected");
          setCheatWarning("Your face must be visible at all times during the exam.");
        } else if (detections.length > 1) {
          setCheatCount((c) => c + 1);
          setCheatReason("Multiple faces detected");
          setCheatWarning("Only one person is allowed in front of the camera during the exam.");
        }
      } catch (err) {
        // Ignore detection errors
      }
    }, 4000);
    detectionInterval.current = interval;
    return () => {
      stopped = true;
      if (interval) clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [faceLoaded, cameraReady, examCancelled]);

  // Cancel exam if cheating threshold exceeded
  useEffect(() => {
    if (cheatCount >= CHEAT_THRESHOLD && !examCancelled) {
      setExamCancelled(true);
      setCheatWarning("");
      // Clean up intervals and event listeners
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }, [cheatCount, examCancelled]);

  const handleOption = (qid, option) => {
    if (examCancelled) return;
    setAnswers(a => ({ ...a, [qid]: option }));
  };
  const handlePrev = () => { if (!examCancelled) setCurrent(c => Math.max(0, c - 1)); };
  const handleNext = () => { if (!examCancelled) setCurrent(c => Math.min(questions.length - 1, c + 1)); };
  const handleSummary = () => { if (!examCancelled) setShowSummary(true); };
  const handleBackToQuestions = () => { if (!examCancelled) setShowSummary(false); };
  const handleSubmit = () => {
    if (examCancelled) return;
    setSubmitted(true);
    setShowSummary(false);
    setScore(Math.floor(Math.random() * (questions.length + 1)));
  };

  // Progress percentage
  const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;

  if (examCancelled) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-lg flex flex-col items-center animate-fade-in">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Exam Cancelled</h2>
          <p className="text-lg text-gray-700 mb-4">Cheating detected: <span className="font-bold">{cheatReason}</span></p>
          <p className="text-gray-500">Your exam has been cancelled due to multiple cheating events. Please contact support if you believe this is a mistake.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center py-0 px-0">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-indigo-100 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-2">
          <span className="text-xs text-gray-500">Question {current + 1} of {questions.length}</span>
          <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          {/* Webcam preview for proctoring */}
          <div className="flex items-center gap-2 ml-4">
            <FaVideo className="text-indigo-400" />
            <video ref={videoRef} autoPlay muted width={40} height={30} className="rounded border border-indigo-200" style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      {/* Camera error/warning */}
      {cameraError && (
        <div className="w-full max-w-2xl mx-auto mt-4 mb-2 animate-fade-in">
          <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3 flex items-center gap-2">
            <FaCamera className="w-5 h-5" />
            <span>{cameraError}</span>
          </div>
        </div>
      )}
      {/* Cheating warning */}
      {cheatWarning && !examCancelled && (
        <div className="w-full max-w-2xl mx-auto mt-4 mb-2 animate-fade-in">
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-3 flex items-center gap-2">
            <FaExclamationTriangle className="w-5 h-5" />
            <span>{cheatWarning}</span>
          </div>
        </div>
      )}
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
                        disabled={examCancelled}
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
                    disabled={current === 0 || examCancelled}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaArrowLeft /> Previous
                  </button>
                  <div className="flex gap-2">
                    {current < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                        disabled={examCancelled}
                      >
                        Next <FaArrowRight />
                      </button>
                    ) : (
                      <button
                        onClick={handleSummary}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                        disabled={examCancelled}
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
                    disabled={examCancelled}
                  >
                    <FaArrowLeft /> Back to Questions
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-8 rounded-lg shadow transition flex items-center gap-2"
                    disabled={examCancelled}
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
