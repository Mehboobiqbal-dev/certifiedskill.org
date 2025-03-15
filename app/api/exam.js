import connectDB from "../../lib/db";
import Exam from '../../pages/models/Exam';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';


export default async function handler(req, res) {
  console.log("Incoming request:", req.method, req.query);

  try {
    await connectToDatabase();
    console.log("Connected to database");

    const { id } = req.query;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return res.status(400).json({ message: "Invalid exam ID" });
    }

    if (req.method === 'GET') {
      const exam = await Exam.findById(id);
      if (!exam) {
        console.log("Exam not found for ID:", id);
        return res.status(404).json({ message: 'Exam not found' });
      }

      console.log("Exam found:", exam);
      return res.status(200).json(exam);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error in API:", error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}