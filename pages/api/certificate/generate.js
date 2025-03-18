import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    // Payload: { userId, userName, examId, examName, passed }
    const { userId, userName, examId, examName, passed } = req.body;
    if (!passed) {
      return res.status(400).json({ message: 'User did not pass the exam' });
    }
    
    // Connect to your database.
    const connection = await connectToDatabase();
    // Depending on your connection helper, ensure you get the native DB instance:
    const db = connection.db || connection.useDb('myDatabase');
    
    // Check if a certificate already exists for this user and exam.
    let certificate = await db.collection('certificates').findOne({ userId, examId });
    if (!certificate) {
      certificate = {
        userId,
        userName,
        examId,
        examName,
        certificateNumber: uuidv4(),
        issuedAt: new Date()
      };
      await db.collection('certificates').insertOne(certificate);
    }
    
    // Set headers to signal a PDF response.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');

    // Create a new PDF document.
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    // Pipe PDF document directly to the response.
    doc.pipe(res);
    
    // --- Certificate Design ---
    // Draw a light background.
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f9f9f9');
    
    // Add a decorative border.
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(4)
      .stroke('#003366');
    
    // Certificate title.
    doc.fillColor('#003366')
       .fontSize(48)
       .text('Certificate of Achievement', { align: 'center', underline: true });
    doc.moveDown(1.5);
    
    // Recipient details.
    doc.fontSize(32)
       .text('This certifies that', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(40)
       .text(userName, { align: 'center' });
    doc.moveDown(1);
    
    // Exam details.
    doc.fontSize(28)
       .text('has successfully passed the exam for', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(36)
       .text(examName, { align: 'center' });
    doc.moveDown(1.5);
    
    // Issue details.
    doc.fontSize(20)
       .text(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, { align: 'center' })
       .moveDown(0.5)
       .text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'center' });
    // -----------------------
    
    doc.end();
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
