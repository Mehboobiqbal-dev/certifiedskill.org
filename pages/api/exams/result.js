import connectToDatabase from '../../../lib/db';

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
      // One week in milliseconds
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const lastAttemptDate = new Date(existing.createdAt);
      if ((new Date() - lastAttemptDate) < oneWeek) {
        return res.status(400).json({ 
          message: 'You already attempted this exam! Please try again after one week.' 
        });
      }
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

    return res
      .status(200)
      .json({ message: 'Result saved successfully', data: resultData });
  } catch (error) {
    console.error('Error saving exam result:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}
