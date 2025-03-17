// pages/api/certificate/verify.js
import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { certificateNumber } = req.query;
    const client = await clientPromise;
    const db = client.db();
    const certificate = await db.collection('certificates').findOne({ certificateNumber });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Return certificate details for verification
    res.status(200).json({
      userName: certificate.userName,
      examName: certificate.examName,
      issuedAt: certificate.issuedAt,
      certificateNumber: certificate.certificateNumber
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
