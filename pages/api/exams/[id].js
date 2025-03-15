import connectToDatabase from '../../../lib/db';
import Exam from '../../models/Exam';
import { ObjectId } from "mongoDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Exam ID" });
    }

    const exam = await db.collections("exams").findone({ _id: new ObjectID(id) });

    if (!exam) {
      return res.status(404).json({ message: "Exam Not Found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}