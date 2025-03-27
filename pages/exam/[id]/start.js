// pages/exams/[id]/start.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AntiCheating from "../../../components/AntiCheating";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/authOptions";
import connectToDatabase from "../../../lib/db";
import Exam from "../../../models/exam";

export default function ExamPage({ exam }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non-signed in users to sign-in
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/sign-in");
    }
  }, [session, status, router]);

  // Exam state & timer logic
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [cheatingCount, setCheatingCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const QUESTION_TIME = 20; // seconds per question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME);

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setQuestionTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (currentQuestionIndex === exam.questions.length - 1) {
            handleSubmit(); // Auto-submit on last question
            return 0;
          } else {
            proceedToNextQuestion();
            return QUESTION_TIME;
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, currentQuestionIndex]);

  const proceedToNextQuestion = () => {
    setTimeTaken((prev) => prev + (QUESTION_TIME - questionTimeLeft));
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimeLeft(QUESTION_TIME);
    }
  };

  const handleOptionChange = (selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));

    if (currentQuestionIndex < exam.questions.length - 1) {
      proceedToNextQuestion();
    }
  };

  const handleSubmitClick = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const correctCount = exam.questions.reduce((count, question, idx) => {
      return userAnswers[idx] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const total = exam.questions.length;
    const passingScore = 40;
    const passed = correctCount >= passingScore;

    const resultData = {
      userId: session.user.id,
      examId: exam._id,
      userName: session.user.name,
      examName: exam.title,
      score: correctCount,
      total,
      passed,
      timeTaken,
      cheatingCount,
      createdAt: new Date(),
    };

    await onExamSubmit(resultData);
  };

  const handleCheatingDetected = () => {
    setCheatingCount((prev) => prev + 1);
  };

  if (!exam.questions || exam.questions.length === 0) {
    return <p className="text-center mt-20 text-gray-600">No questions found.</p>;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <AntiCheating onCheatingDetected={handleCheatingDetected} />
      <Head>
        <title>{exam.title} | Exam Portal</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-800">{exam.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </h2>
            <div className="mt-2">
              {/* Visual timer progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(questionTimeLeft / QUESTION_TIME) * 100}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Time remaining: {questionTimeLeft} seconds
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-800 font-semibold">
              {currentQuestion.questionText}
            </p>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, i) => (
              <label
                key={i}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors 
                  ${userAnswers[currentQuestionIndex] === option ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white"}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  onChange={() => handleOptionChange(option)}
                  checked={userAnswers[currentQuestionIndex] === option}
                  className="form-radio h-5 w-5 text-indigo-600 mr-3"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          {currentQuestionIndex === exam.questions.length - 1 && (
            <button
              onClick={handleSubmitClick}
              className="mt-8 w-full py-3 text-black bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-colors"
            >
              Submit Exam
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Ensure the user is signed in
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  try {
    await connectToDatabase();
    const { id } = context.params;
    const exam = await Exam.findById(id).lean();

    if (!exam || !exam.questions) {
      return { notFound: true };
    }

    // Convert exam fields to serializable types
    exam._id = exam._id.toString();
    if (exam.createdAt) exam.createdAt = exam.createdAt.toISOString();
    if (exam.updatedAt) exam.updatedAt = exam.updatedAt.toISOString();

    // Remove the date fields that are causing serialization issues:
    if (exam.startTime) delete exam.startTime;
    if (exam.endTime) delete exam.endTime;

    // Convert each question's _id and date fields to strings if needed
    exam.questions = exam.questions.map((question) => ({
      ...question,
      _id: question._id.toString(),
      createdAt: question.createdAt ? new Date(question.createdAt).toISOString() : null,
      updatedAt: question.updatedAt ? new Date(question.updatedAt).toISOString() : null,
    }));

    return { props: { exam } };
  } catch (error) {
    console.error("Error fetching exam:", error);
    return { notFound: true };
  }
}

async function onExamSubmit(resultData) {
  try {
    const resultRes = await fetch("/api/exams/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
      cache: "no-store",
    });
    const resultJson = await resultRes.json();

    if (!resultRes.ok) {
      // Display the error message returned from the API.
      toast.error(
        resultJson.message ||
          "Error submitting your exam results. Please try again later."
      );
      console.error(resultJson.message);
      return;
    }

    if (resultData.passed) {
      toast.success(
        "Congratulations! You passed the exam. Your certificate is being generated."
      );
      const certRes = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resultData.userId,
          examId: resultData.examId,
          userName: resultData.userName,
          examName: resultData.examName,
          passed: resultData.passed,
        }),
        cache: "no-store",
      });

      if (certRes.ok) {
        const blob = await certRes.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } else {
        const certJson = await certRes.json();
        toast.error(
          "There was an error generating your certificate. Please try again later."
        );
        console.error(certJson.message);
      }
    } else {
      toast.error("Unfortunately, you did not pass the exam. Please try again.");
    }
  } catch (error) {
    toast.error(
      "An unexpected error occurred during submission. Please contact support."
    );
    console.error("Submission error:", error);
  }
}