import connectDB from "../../lib/db";
import ExamSubmission from "../../pages/models/ExamSubmission"; // Ensure this path is correct
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    // Only handle POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Fetch user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Connect to MongoDB
    await connectDB();

    // Automatically extract and validate required fields from the body
    const { examId, answers } = req.body;
    if (!examId || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Missing exam ID or answers" });
    }

    // Check if the user has already submitted this exam
    const existingSubmission = await ExamSubmission.findOne({
      user: session.user.id,
      exam: examId,
    });
    if (existingSubmission) {
      return res
        .status(400)
        .json({ message: "You have already submitted this exam" });
    }

    // Build the submission object
    const submission = new ExamSubmission({
      user: session.user.id, // User's ID from session
      userName: session.user.name || "Unknown", // User's name from session
      exam: examId,
      answers, // User's answers from the request
      createdAt: new Date(), // Automatically set to current timestamp
    });

    // Save the submission to the database
    await submission.save();

    return res
      .status(200)
      .json({ message: "Exam submitted successfully", submission });
  } catch (error) {
    console.error("Error handling exam submission:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
