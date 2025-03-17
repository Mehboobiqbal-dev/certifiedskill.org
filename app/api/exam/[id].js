import connectDB from "../../../../lib/db";
import exam from "../../../../pages/models/exam";
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const { id } = req.query;
    const session = await getSession({ req });
  
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    await connectDB();
    const exam = await Exam.findById(id);
  
    if (!exam || !exam.assignedTo.some((userId) => userId.toString() === session.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    res.status(200).json(exam);
  }