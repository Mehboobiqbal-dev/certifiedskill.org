import connectToDatabase from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Destructure { db } from the object returned by connectToDatabase()
    const { db } = await connectToDatabase();
    const { id } = req.query;

    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Exam ID" });
    }

    // Query the database for the exam
    const exam = await db.collection("exams").findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return res.status(404).json({ message: "Exam Not Found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
