import connectToDatabase from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const { sessionId } = req.query;

    // Validate sessionId
    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid or Missing Session ID" });
    }

    // Fetch exam by sessionId
    const exam = await db
      .collection("exams")
      .findOne({ _id: new ObjectId(sessionId) });

    if (!exam) {
      return res.status(404).json({ message: "Exam Not Found" });
    }

    // Respond with sanitized exam data
    res.status(200).json({
      text: exam.questionText || "No question text available",
      options: exam.options || [],
    });
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
