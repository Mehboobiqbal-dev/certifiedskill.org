import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AntiCheating from "../../components/AntiCheating";
import { useSession } from "next-auth/react";

// Import NextAuth server-side helper and your auth options
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../app/api/auth/[...nextauth]/authOptions";

import connectToDatabase from "../../lib/db";
import Exam from "../../models/exam";

export default function ExamPage({ exam }) {
  // Always call hooks unconditionally.
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [cheatingCount, setCheatingCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);

  // Timer effect
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

  const handleOptionChange = (qIndex, selectedOption) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: selectedOption }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (submitted) return;
    setSubmitted(true);

    // Calculate exam score
    const correctCount = exam.questions.reduce(
      (count, question, idx) =>
        userAnswers[idx] === question.correctAnswer ? count + 1 : count,
      0
    );
    const total = exam.questions.length;
    const passingScore = 40; // your passing threshold
    const passed = correctCount >= passingScore;
    const computedTimeTaken = 40 * 60 - timeLeft;
    setTimeTaken(computedTimeTaken);

    // Use dynamic session values for userId and userName.
    const resultData = {
      userId: session?.user?.id, // from session data
      examId: exam._id,
      userName: session?.user?.name,
      examName: exam.title,
      score: correctCount,
      total,
      passed,
      timeTaken: computedTimeTaken,
      cheatingCount,
      createdAt: new Date(),
    };

    await onExamSubmit(resultData);
  };

  const handleCheatingDetected = () => {
    setCheatingCount((prev) => prev + 1);
  };

  const getOptionClass = (question, option, qIndex) => {
    if (!submitted) return "cursor-pointer";
    if (option === question.correctAnswer) return "bg-green-100";
    if (userAnswers[qIndex] === option && option !== question.correctAnswer)
      return "bg-red-100";
    return "";
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const correctCountForDisplay = exam.questions.reduce(
    (count, question, idx) =>
      userAnswers[idx] === question.correctAnswer ? count + 1 : count,
    0
  );

  return (
    <div className="relative">
      {/* Optional: Render a loading state if session is still loading */}
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <>
          <AntiCheating onCheatingDetected={handleCheatingDetected} />

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
                        className={`block p-2 mb-2 border rounded ${getOptionClass(
                          q,
                          option,
                          index
                        )}`}
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
                        <span className="text-green-600 font-semibold">
                          Correct!
                        </span>
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
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                  Submit Answers
                </button>
              )}

              {submitted && (
                <div className="mt-4">
                  <p className="text-xl font-bold">
                    You got {correctCountForDisplay} out of{" "}
                    {exam.questions.length} correct!
                  </p>
                  <p className="text-lg">
                    {correctCountForDisplay >= 40
                      ? "Congratulations! You have passed the exam."
                      : "Sorry, you did not pass the exam."}
                  </p>
                  {timeTaken !== null && (
                    <p className="text-lg">
                      Time Taken: {Math.floor(timeTaken / 60)} minutes{" "}
                      {timeTaken % 60} seconds.
                    </p>
                  )}
                  <p className="text-lg">
                    Cheating Attempts: {cheatingCount}
                  </p>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

// onExamSubmit: submits the exam result and (if passed) automatically triggers certificate generation.
async function onExamSubmit(resultData) {
  try {
    // Save exam result.
    const resultRes = await fetch("/api/exams/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
      cache: "no-store",
    });
    const resultJson = await resultRes.json();
    if (!resultRes.ok) {
      console.error(resultJson.message);
      return;
    }

    // If passed, automatically generate certificate.
    if (resultData.passed) {
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
      const certJson = await certRes.json();
      if (certRes.ok) {
        alert(
          "Certificate generated! Certificate Number: " +
            certJson.certificateNumber
        );
        // Optionally: Redirect to certificate page
        // router.push(`/certificate/${certJson.certificateNumber}`);
      } else {
        console.error(certJson.message);
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
  }
}

export async function getServerSideProps(context) {
  // Verify that the user is authenticated
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: { destination: "/sign-in", permanent: false },
    };
  }

  // Connect to the database and fetch the exam data
  try {
    await connectToDatabase();
    const exam = await Exam.findById(context.params.id);

    if (!exam || !exam.questions) {
      return { notFound: true };
    }

    // Convert documents (like ObjectIDs) to plain objects
    const examObj = JSON.parse(JSON.stringify(exam));
    return { props: { exam: examObj } };
  } catch (error) {
    console.error("Error fetching exam:", error);
    return { notFound: true };
  }
}
