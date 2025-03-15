import connectDB from "../../lib/db";
import Exam from '../../pages/models/Exam';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    await connectDB();
  
    if (req.method === 'POST') {
      if (session.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const examData = { ...req.body, createdBy: session.user.id };
      const exam = new Exam(examData);
      await exam.save();
      res.status(201).json({ message: 'Exam created', exam });
    } else if (req.method === 'GET') {
      const now = new Date();
      const exams = await Exam.find({
        assignedTo: session.user.id,
        startTime: { $lte: now },
        endTime: { $gte: now },
      });
      res.status(200).json(exams);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }