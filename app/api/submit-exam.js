import connectDB from "../../lib/db";
import ExamSubmission from '../../pages/models/ExamSubmission';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  await connectDB();
  const submission = new ExamSubmission({
    user: session.user.id,
    exam: req.body.examId,
    answers: req.body.answers,
  });
  await submission.save();
  res.status(200).json({ message: 'Exam submitted successfully' });
}