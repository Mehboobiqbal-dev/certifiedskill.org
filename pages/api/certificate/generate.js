// pages/api/certificate/generate.js
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '../../../lib/db';
import { Readable } from 'stream';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Expected payload: { userId, userName, examId, examName, passed }
    const { userId, userName, examId, examName, passed } = req.body;
    if (!passed) {
      return res.status(400).json({ message: 'User did not pass the exam' });
    }

    // Connect to MongoDB.
    const client = await clientPromise;
    const db = client.db();

    // Check if a certificate already exists for the user and exam.
    const existing = await db.collection('certificates').findOne({ userId, examId });
    if (existing) {
      return res.status(200).json({ certificateNumber: existing.certificateNumber });
    }

    // Generate a unique certificate number.
    const certificateNumber = uuidv4();

    // Create a PDF certificate using PDFKit.
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    let buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // Save certificate record in MongoDB.
      await db.collection('certificates').insertOne({
        userId,
        examId,
        userName,
        examName,
        certificateNumber,
        issuedAt: new Date(),
        // Optionally, store pdfData or a reference to where it's stored.
      });

      // Return the certificate number (or a download URL if implemented).
      res.status(200).json({ certificateNumber });
    });

    // Create certificate content.
    doc.fontSize(30).text('Certificate of Achievement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`This certifies that ${userName}`, { align: 'center' });
    doc.moveDown();
    doc.text(`has successfully passed the exam for ${examName}`, { align: 'center' });
    doc.moveDown();
    doc.text(`Certificate Number: ${certificateNumber}`, { align: 'center' });
    doc.moveDown();
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
