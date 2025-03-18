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
    const db = connection.db || connection.useDb('myDatabase'); // Adjust DB name if needed

    // Check if a certificate already exists for this user and exam.
    let certificate = await db.collection('certificates').findOne({ userId, examId });
    
    if (certificate) {
      // If a certificate already exists but certificateId is missing, update it.
      if (!certificate.certificateId) {
        certificate.certificateId = uuidv4();
        await db.collection('certificates').updateOne(
          { _id: certificate._id },
          { $set: { certificateId: certificate.certificateId } }
        );
      }
    } else {
      // Create a new certificate entry with a valid certificateId.
      certificate = {
        userId,
        userName,
        examId,
        examName,
        certificateId: uuidv4(), // Generate a unique id.
        issuedAt: new Date()
      };
      await db.collection('certificates').insertOne(certificate);
    }
    
    // Set headers so the PDF is rendered inline.
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
    
    // Retrieve page dimensions.
    const { width, height } = doc.page;
    
    // --- Certificate Design ---
    // Draw a light background.
    doc.rect(0, 0, width, height).fill('#f9f9f9');
    
    // Add a decorative border.
    doc.rect(30, 30, width - 60, height - 60)
      .lineWidth(4)
      .stroke('#003366');
    
    // Use absolute positioning for text to keep everything on one page.
    // Certificate Title
    doc.fillColor('#003366')
       .fontSize(48)
       .text('Certificate of Achievement', 0, 80, {
         width,
         align: 'center',
         underline: true
       });
    
    // "This certifies that"
    doc.fontSize(32)
       .text('This certifies that', 0, 160, { width, align: 'center' });
    
    // Recipient Name
    doc.fontSize(40)
       .text(userName, 0, 210, { width, align: 'center' });
    
    // "has successfully passed the exam for"
    doc.fontSize(28)
       .text('has successfully passed the exam for', 0, 280, {
         width,
         align: 'center'
       });
    
    // Exam Name
    doc.fontSize(36)
       .text(examName, 0, 320, { width, align: 'center' });
    
    // Issue Details
    doc.fontSize(20)
       .text(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, 0, 400, {
         width,
         align: 'center'
       });
    
    doc.fontSize(20)
       .text(`Certificate ID: ${certificate.certificateId}`, 0, 430, {
         width,
         align: 'center'
       });
    // -----------------------
    
    doc.end();
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
