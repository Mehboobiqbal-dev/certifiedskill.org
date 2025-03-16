// pages/api/exams/index.js
import nextConnect from 'next-connect';
import connectToDatabase from '../../../lib/db';
import Exam from '../../../models/Exam';

export default async function handler(req, res) {
  // Connect to the database
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { title, questions, duration, startTime, endTime } = req.body;
      // Create a new exam document
      const exam = new Exam({
        title,
        questions,
        duration,
        startTime,
        endTime,
      });
      await exam.save();
      return res.status(201).json({ message: 'Exam created successfully', exam });
    } catch (error) {
      console.error('Error creating exam:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      // Return all exams
      const exams = await Exam.find({});
      return res.status(200).json(exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}