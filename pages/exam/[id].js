// pages/exam/[id].js
import Head from "next/head";
import connectToDatabase from "../../lib/db";
import Exam from "../../models/exam";
import { FaBookOpen, FaExclamationTriangle } from "react-icons/fa";

export default function ExamLanding({ exam }) {
  if (!exam) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">Exam Not Found</h1>
        <p>Sorry, this exam does not exist.</p>
      </div>
    );
  }

  // Render a conditional warning message based on exam properties.
  const renderFailureWarning = () => {
    if (exam.isChallenging) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8 flex items-center gap-4">
          <FaExclamationTriangle className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-1">Warning</h2>
            <p className="text-red-700">
              This exam is known to be highly challenging. Attempting it without thorough preparation may result in failure. Please review all study materials and ensure you understand the content before starting.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8 flex items-center gap-4">
          <FaExclamationTriangle className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold text-yellow-700 mb-1">Important Notice</h2>
            <p className="text-yellow-700">
              Make sure you are well prepared before starting the exam. Insufficient preparation can lead to failure, so please take the time to study and understand the material.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center">
      <Head>
        <title>{exam.title} - Free Certification Exam</title>
        <meta
          name="description"
          content={`Join our ${exam.title} exam to challenge your skills and earn a certification at no cost.`}
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://certifiedskill.org/exam/${exam._id}`} />
        <meta property="og:title" content={`${exam.title} - Free Certification Exam`} />
        <meta
          property="og:description"
          content={`Test your skills with our ${exam.title} exam and get certified. Perfect for professionals looking to validate their expertise.`}
        />
        <meta property="og:url" content={`https://certifiedskill.org/exam/${exam._id}`} />
      </Head>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-200 py-16 px-4 text-center relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[url('/exam-bg.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <FaBookOpen className="w-16 h-16 text-white drop-shadow mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">{exam.title}</h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-6">
            {exam.description || "Take this exam to validate your skills. It is free and offers certification upon passing."}
          </p>
        </div>
      </section>
      <main className="w-full max-w-2xl mx-auto p-6 -mt-12 z-10">
        {renderFailureWarning()}
        <div className="flex justify-center mt-8">
          <button
            className="bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            onClick={() => (window.location.href = `/exam/${exam._id}/start`)}
          >
            Start Exam
          </button>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    await connectToDatabase();
    const { id } = context.params;

    // Validate that the "id" is a valid 24-character hexadecimal string.
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return { notFound: true };
    }

    const exam = await Exam.findById(id).lean();
    if (!exam) {
      return { notFound: true };
    }

    // Convert any unserializable values and ensure IDs are strings.
    let serializableExam = JSON.parse(
      JSON.stringify(exam, (key, value) => {
        if (typeof value === "function") {
          return undefined;
        }
        return value;
      })
    );

    // Convert _id and nested question IDs to strings.
    if (serializableExam._id) {
      serializableExam._id = serializableExam._id.toString();
    }
    if (Array.isArray(serializableExam.questions)) {
      serializableExam.questions = serializableExam.questions.map((question) => {
        if (question._id) {
          question._id = question._id.toString();
        }
        return question;
      });
    }

    return { props: { exam: serializableExam } };
  } catch (error) {
    console.error("Error fetching exam:", error);
    return { notFound: true };
  }
}
