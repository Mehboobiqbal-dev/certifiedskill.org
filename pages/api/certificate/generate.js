import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Expected Payload: { userId, userName, examId, examName, passed }
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
      // If a certificate exists but certificateId is missing, update it.
      if (!certificate.certificateId) {
        certificate.certificateId = uuidv4();
        await db.collection('certificates').updateOne(
          { _id: certificate._id },
          { $set: { certificateId: certificate.certificateId } }
        );
      }
    } else {
      // Create a new certificate entry.
      certificate = {
        userId,
        userName,
        examId,
        examName,
        certificateId: uuidv4(), // Generate a unique ID.
        issuedAt: new Date()
      };
      await db.collection('certificates').insertOne(certificate);
    }

    // Set headers to render the PDF inline.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');

    // Create a new PDF document with landscape orientation.
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Pipe the PDF document directly to the response.
    doc.pipe(res);

    // Get page dimensions.
    const { width, height } = doc.page;

    // --- Professional Certificate Design ---

    // 1. Background & Border:
    doc.rect(0, 0, width, height).fill('#ffffff'); // White background.
    doc.rect(40, 40, width - 80, height - 80)
      .lineWidth(2)
      .stroke('#333333'); // Clean, modern border.

    // 2. Header: Brand Information.
    doc.fillColor('#333333')
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('CertifiedSkill.org', 0, 60, { align: 'center' });
    doc.font('Helvetica')
      .fontSize(12)
      .text('Your trusted partner in professional certifications', {
        align: 'center'
      });

    // 3. Certificate Title.
    doc.moveDown(2);
    doc.font('Helvetica-Bold')
      .fontSize(36)
      .text('Certificate of Achievement', {
        align: 'center',
        underline: true
      });

    // 4. Certificate Details.
    doc.moveDown(1.5);
    doc.font('Helvetica')
      .fontSize(18)
      .text('This certificate verifies that', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold')
      .fontSize(28)
      .text(userName, { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica')
      .fontSize(18)
      .text('has successfully passed the exam:', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold')
      .fontSize(24)
      .text(examName, { align: 'center' });

    // 5. Authenticity Assurance Text.
    doc.moveDown(1.5);
    doc.font('Helvetica')
      .fontSize(14)
      .text(
        'This is an authentic certificate digitally issued by CertifiedSkill.org.',
        { align: 'center' }
      );
    doc.text(
      'Visit CertifiedSkill.org.com to verify its authenticity.',
      { align: 'center' }
    );

    // 6. Footer Details.
    const issuedOn = new Date(certificate.issuedAt).toLocaleDateString();
    // Display Certificate ID on the bottom left:
    doc.font('Helvetica')
      .fontSize(10)
      .text(`Certificate ID: ${certificate.certificateId}`, 50, height - 70, {
        align: 'left'
      });
    // Display issued date on the bottom right.
    doc.font('Helvetica')
      .fontSize(10)
      .text(`Issued on: ${issuedOn}`, -50, height - 70, {
        align: 'right'
      });

    // 7. Signature Placeholder at the bottom-right.
    const signY = height - 100;
    const signX = width - 200;
    doc.moveTo(signX, signY)
      .lineTo(signX + 100, signY)
      .stroke('#333333');
    doc.font('Helvetica')
      .fontSize(10)
      .text('Authorized Signature', signX, signY + 5, {
        align: 'center',
        width: 100
      });
      
    // 8. Add GetCertify Stamp.
    // We'll draw a circular stamp on the bottom left.
    const stampDiameter = 100;
    const stampX = 50; // Adjust X coordinate as needed.
    const stampY = height - stampDiameter - 50; // Adjust Y coordinate as needed.

    // Draw the circular border.
    doc.circle(stampX + stampDiameter / 2, stampY + stampDiameter / 2, stampDiameter / 2)
       .lineWidth(2)
       .stroke('#003366');
       
    // Fill the circle with a semi-transparent fill.
    doc.circle(stampX + stampDiameter / 2, stampY + stampDiameter / 2, stampDiameter / 2)
       .fillOpacity(0.1)
       .fill('#003366');

    // Restore full opacity for text.
    doc.fillOpacity(1);

    // Add the stamp text "GetCertify" inside the circle.
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .fillColor('#003366')
       .text('GetCertify', stampX, stampY + stampDiameter / 2 - 7, {
         width: stampDiameter,
         align: 'center'
       });
      
    // Finalize the PDF and end the stream.
    doc.end();
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
