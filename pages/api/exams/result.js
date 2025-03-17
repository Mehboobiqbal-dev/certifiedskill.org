// pages/api/exams/result.js
import connectToDatabase from '../../../lib/db';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId, examId, score, total, passed, timeTaken } = req.body;

    // Validate required fields
    if (!examId || !userId || score == null || total == null || passed == null || timeTaken == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();

    // Check if a record for this user and exam already exists.
    const existing = await db
      .collection('examResults')
      .findOne({ examId, userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'You have already attempted this exam' });
    }

    // Create the exam result document.
    const resultData = {
      examId,
      userId,
      score,
      total,
      passed,
      timeTaken,
      createdAt: new Date(),
    };

    await db.collection('examResults').insertOne(resultData);

    // If the user passed, optionally trigger certificate generation from here.
    // One option is to call the internal certificate generation logic.
    // For simplicity, you can return a flag indicating certificate generation is needed.

    return res.status(200).json({ message: 'Result saved successfully', data: resultData });
  } catch (error) {
    console.error('Error saving exam result:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
