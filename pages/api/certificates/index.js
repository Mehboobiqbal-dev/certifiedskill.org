import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  // Connect to the database.
  let connection;
  try {
    connection = await connectToDatabase();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ message: 'Database connection failed' });
  }
  
  // Use the desired database (replace 'myDatabase' with your DB name if needed)
  const db = connection.db || connection.useDb('myDatabase');

  if (req.method === 'GET') {
    // If a certificateNumber is provided in the query string, generate the PDF.
    const { certificateNumber, userEmail, userId } = req.query;
    
    if (certificateNumber) {
      try {
        // Find the certificate by its certificateId
        const certificate = await db.collection('certificates').findOne({ certificateId: certificateNumber });
        if (!certificate) {
          return res.status(404).json({ message: 'Certificate not found' });
        }
        
        // Set PDF headers so the file is rendered inline.
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
  
        // Create a new PDF document using your desired style.
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });
  
        // Pipe PDF document to response.
        doc.pipe(res);
  
        // Get page dimensions.
        const { width, height } = doc.page;
  
        // Background and Border
        doc.rect(0, 0, width, height).fill('#ffffff');
        doc.rect(40, 40, width - 80, height - 80).lineWidth(2).stroke('#333333');
  
        // Header: Brand Information
        doc.fillColor('#333333')
          .font('Helvetica-Bold')
          .fontSize(20)
          .text('CertifiedSkill.org', 0, 60, { align: 'center' });
        doc.font('Helvetica')
          .fontSize(12)
          .text('Your trusted partner in professional certifications', { align: 'center' });
  
        // Certificate Title
        doc.moveDown(2);
        doc.font('Helvetica-Bold')
          .fontSize(36)
          .text('Certificate of Achievement', { align: 'center', underline: true });
  
        // Certificate Details
        doc.moveDown(1.5);
        doc.font('Helvetica')
          .fontSize(18)
          .text('This certificate verifies that', { align: 'center' });
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold')
          .fontSize(28)
          .text(certificate.userName, { align: 'center' });
        doc.moveDown(0.5);
        doc.font('Helvetica')
          .fontSize(18)
          .text('has successfully passed the exam:', { align: 'center' });
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold')
          .fontSize(24)
          .text(certificate.examName, { align: 'center' });
  
        // Authenticity Assurance
        doc.moveDown(1.5);
        doc.font('Helvetica')
          .fontSize(14)
          .text('This is an authentic certificate digitally issued by CertifiedSkill.org.', { align: 'center' });
        doc.text('Visit CertifiedSkill.org.com to verify its authenticity.', { align: 'center' });
  
        // Footer Details: Certificate ID and Issued Date
        const issuedOn = new Date(certificate.issuedAt).toLocaleDateString();
        doc.font('Helvetica')
          .fontSize(10)
          .text(`Certificate ID: ${certificate.certificateId}`, 50, height - 70, { align: 'left' });
        doc.font('Helvetica')
          .fontSize(10)
          .text(`Issued on: ${issuedOn}`, -50, height - 70, { align: 'right' });
  
        // Signature Section
        const signY = height - 100;
        const signX = width - 200;
        const signaturePath = path.join(process.cwd(), 'public/image.png');
  
        if (fs.existsSync(signaturePath)) {
          doc.image(signaturePath, signX, signY - 40, { width: 100, height: 50 });
        }
  
        doc.moveTo(signX, signY).lineTo(signX + 100, signY).stroke('#333333');
        doc.font('Helvetica')
          .fontSize(10)
          .text('Authorized Signature', signX, signY + 5, { align: 'center', width: 100 });
  
        // Finalize the PDF and send the response.
        doc.end();
        return;
      } catch (error) {
        console.error('Error generating certificate PDF:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
    
    // Otherwise, if no certificateNumber is provided, list certificates
    if (!userEmail && !userId) {
      return res.status(400).json({ message: 'Please provide a userEmail or userId in the query string' });
    }
    
    const query = {};
    if (userEmail) query.userEmail = userEmail;
    if (userId) query.userId = userId;
    
    try {
      const certificates = await db.collection('certificates').find(query).toArray();
      console.log(`Found ${certificates.length} certificate(s) for query:`, query);
      return res.status(200).json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  
  } else if (req.method === 'POST') {
    // POST: Create or update a certificate record.
    const { userId, userName, examId, examName, passed, userEmail } = req.body;
    
    if (passed !== true && passed !== 'true') {
      console.error('Exam not passed:', req.body);
      return res.status(400).json({ message: 'User did not pass the exam' });
    }
    
    try {
      let certificate = await db.collection('certificates').findOne({ userId, examId });
  
      if (certificate) {
        console.log('Existing certificate found:', certificate);
        if (!certificate.certificateId) {
          certificate.certificateId = uuidv4();
          await db.collection('certificates').updateOne(
            { _id: certificate._id },
            { $set: { certificateId: certificate.certificateId } }
          );
          console.log('Updated certificate with new certificateId:', certificate.certificateId);
        }
      } else {
        certificate = {
          userId,
          userName,
          examId,
          examName,
          certificateId: uuidv4(),
          issuedAt: new Date(),
          ...(userEmail && { userEmail })
        };
        await db.collection('certificates').insertOne(certificate);
        console.log('Created new certificate:', certificate);
      }
      return res.status(200).json(certificate);
    } catch (error) {
      console.error('Certificate generation error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
