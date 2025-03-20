// pages/api/certificates/index.js

import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  // Connect to the database for both GET and POST methods.
  let connection;
  try {
    connection = await connectToDatabase();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ message: 'Database connection failed' });
  }
  
  // Use the native Db instance. Replace 'myDatabase' with your database name if needed.
  // If your MONGO_URI already specifies a default DB, connection.db should exist.
  const db = connection.db || connection.useDb('myDatabase');
  // Alternatively, if you know your connection always has a DB, you can use:
  // const db = connection.db;

  if (req.method === 'GET') {
    // GET: List certificates for a user (query by userEmail or userId).
    const { userEmail, userId } = req.query;
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
    // POST: Generate a certificate PDF for a passed exam.
    // Expected Payload: { userId, userName, examId, examName, passed, [userEmail] }
    const { userId, userName, examId, examName, passed, userEmail } = req.body;
    
    // Allow a boolean true or string "true" to indicate a passing exam.
    if (passed !== true && passed !== 'true') {
      console.error('Exam not passed:', req.body);
      return res.status(400).json({ message: 'User did not pass the exam' });
    }
    
    try {
      // Check if a certificate already exists for this user and exam.
      let certificate = await db.collection('certificates').findOne({ userId, examId });
  
      if (certificate) {
        console.log('Existing certificate found:', certificate);
        // If certificate exists but is missing a certificateId, update it.
        if (!certificate.certificateId) {
          certificate.certificateId = uuidv4();
          await db.collection('certificates').updateOne(
            { _id: certificate._id },
            { $set: { certificateId: certificate.certificateId } }
          );
          console.log('Updated certificate with new certificateId:', certificate.certificateId);
        }
      } else {
        // Create a new certificate record.
        certificate = {
          userId,
          userName,
          examId,
          examName,
          certificateId: uuidv4(), // Generate a unique certificate ID.
          issuedAt: new Date(),
          ...(userEmail && { userEmail })
        };
        await db.collection('certificates').insertOne(certificate);
        console.log('Created new certificate:', certificate);
      }
  
      // Set headers to render the PDF inline.
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
  
      // Create a new PDF document with a landscape layout.
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
  
      // Pipe the PDF document directly to the response.
      doc.pipe(res);
  
      // Get the page dimensions.
      const { width, height } = doc.page;
  
      // -------------------------------
      // Professional Certificate Design
      // -------------------------------
  
      // 1. Background & Border.
      doc.rect(0, 0, width, height).fill('#ffffff'); // White background.
      doc
        .rect(40, 40, width - 80, height - 80)
        .lineWidth(2)
        .stroke('#333333'); // Clean, modern border.
  
      // 2. Header: Brand Information.
      doc
        .fillColor('#333333')
        .font('Helvetica-Bold')
        .fontSize(20)
        .text('CertifiedSkill.org', 0, 60, { align: 'center' });
      doc
        .font('Helvetica')
        .fontSize(12)
        .text('Your trusted partner in professional certifications', { align: 'center' });
  
      // 3. Certificate Title.
      doc.moveDown(2);
      doc
        .font('Helvetica-Bold')
        .fontSize(36)
        .text('Certificate of Achievement', { align: 'center', underline: true });
  
      // 4. Certificate Details.
      doc.moveDown(1.5);
      doc
        .font('Helvetica')
        .fontSize(18)
        .text('This certificate verifies that', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(userName, { align: 'center' });
      doc.moveDown(0.5);
      doc
        .font('Helvetica')
        .fontSize(18)
        .text('has successfully passed the exam:', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text(examName, { align: 'center' });
  
      // 5. Authenticity Assurance Text.
      doc.moveDown(1.5);
      doc
        .font('Helvetica')
        .fontSize(14)
        .text('This is an authentic certificate digitally issued by CertifiedSkill.org.', { align: 'center' });
      doc
        .text('Visit CertifiedSkill.org.com to verify its authenticity.', { align: 'center' });
  
      // 6. Footer Details.
      const issuedOn = new Date(certificate.issuedAt).toLocaleDateString();
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Certificate ID: ${certificate.certificateId}`, 50, height - 70, { align: 'left' });
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Issued on: ${issuedOn}`, -50, height - 70, { align: 'right' });
  
      // 7. Signature Placeholder at the bottom-right.
      const signY = height - 100;
      const signX = width - 200;
      doc
        .moveTo(signX, signY)
        .lineTo(signX + 100, signY)
        .stroke('#333333');
      doc
        .font('Helvetica')
        .fontSize(10)
        .text('Authorized Signature', signX, signY + 5, { align: 'center', width: 100 });
  
      // 8. Add GetCertify Stamp.
      const stampDiameter = 100;
      const stampX = 50; // Adjust as needed.
      const stampY = height - stampDiameter - 50; // Adjust as needed.
      doc
        .circle(stampX + stampDiameter / 2, stampY + stampDiameter / 2, stampDiameter / 2)
        .lineWidth(2)
        .stroke('#003366');
      doc
        .circle(stampX + stampDiameter / 2, stampY + stampDiameter / 2, stampDiameter / 2)
        .fillOpacity(0.1)
        .fill('#003366');
      doc.fillOpacity(1);
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#003366')
        .text('GetCertify', stampX, stampY + stampDiameter / 2 - 7, {
          width: stampDiameter,
          align: 'center'
        });
  
      // Finalize and end the PDF stream.
      doc.end();
      console.log('Certificate PDF generated successfully.');
    } catch (error) {
      console.error('Certificate generation error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
