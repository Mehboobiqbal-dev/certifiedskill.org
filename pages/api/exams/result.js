import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Destructure the expected result data from the request body.
    // It should include examId, score, total, passed, and timeTaken.
    const { examId, score, total, passed, timeTaken } = req.body;

    // Validate required fields
    if (!examId || score == null || total == null || passed == null || timeTaken == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Connect to MongoDB using your cached connection.
    const { db } = await connectToDatabase();

    // Create the result document. You can add extra fields as needed.
    const resultData = {
      examId,
      score,
      total,
      passed,
      timeTaken,
      createdAt: new Date(), // Timestamp for when the result was recorded
    };

    // Insert the result into the "examResults" collection.
    await db.collection('examResults').insertOne(resultData);

    // Return a success response.
    return res.status(200).json({ message: 'Result saved successfully', data: resultData });
  } catch (error) {
    console.error('Error saving exam result:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
