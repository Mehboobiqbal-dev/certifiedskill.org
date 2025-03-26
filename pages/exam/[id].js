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
        <h1 className="text-4xl font-bold mb-4">{exam.title}</h1>
        <p className="mb-4">
          {exam.description ||
            "Take this exam to validate your skills. It is free and offers certification upon passing."}
        </p>
        <button
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => (window.location.href = `/exam/${exam._id}/start`)}
        >
          Start Exam
        </button>
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
    
    // Use JSON.stringify with a replacer to omit any functions (or other unserializable values)
    // and then parse back to a plain object.
    let serializableExam = JSON.parse(JSON.stringify(exam, (key, value) => {
      if (typeof value === "function") {
        return undefined;
      }
      return value;
    }));
    
    // Ensure that our main _id and any nested question _id are explicitly converted to strings.
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
