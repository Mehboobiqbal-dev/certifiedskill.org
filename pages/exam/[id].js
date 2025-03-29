// pages/exam/[id].js
import Head from "next/head";
import connectToDatabase from "../../lib/db";
import Exam from "../../models/exam";

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
  // For example, if the exam is flagged as challenging, show a red warning.
  // Otherwise, display a yellow notice reminding users to be prepared.
  const renderFailureWarning = () => {
    if (exam.isChallenging) {
      return (
        <div className="bg-red-100 border border-red-200 rounded p-4 my-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Warning</h2>
          <p className="text-red-800">
            This exam is known to be highly challenging. Attempting it without thorough preparation
            may result in failure. Please review all study materials and ensure you understand the
            content before starting.
          </p>
        </div>
      );
    } else {
      return (
        <div className="bg-yellow-100 border border-yellow-200 rounded p-4 my-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">Important Notice</h2>
          <p className="text-yellow-800">
            Make sure you are well prepared before starting the exam. Insufficient preparation can
            lead to failure, so please take the time to study and understand the material.
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>{exam.title} - Free Certification Exam</title>
        <meta
          name="description"
          content={`Join our ${exam.title} exam to challenge your skills and earn a certification at no cost.`}
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://certifiedskill.org/exam/${exam._id}`} />

        {/* Open Graph tags */}
        <meta property="og:title" content={`${exam.title} - Free Certification Exam`} />
        <meta
          property="og:description"
          content={`Test your skills with our ${exam.title} exam and get certified. Perfect for professionals looking to validate their expertise.`}
        />
        <meta property="og:url" content={`https://certifiedskill.org/exam/${exam._id}`} />
      </Head>

      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6">{exam.title}</h1>
        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          {exam.description ||
            "Take this exam to validate your skills. It is free and offers certification upon passing."}
        </p>
        {renderFailureWarning()}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md"
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
