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

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    doc.pipe(res);
    
    const { width, height } = doc.page;
    
    doc.rect(0, 0, width, height).fill('#ffffff');
    doc.rect(40, 40, width - 80, height - 80).lineWidth(2).stroke('#333333');

    doc.fillColor('#333333')
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('CertifiedSkill.org', 0, 60, { align: 'center' });
    doc.font('Helvetica')
      .fontSize(12)
      .text('Your trusted partner in professional certifications', { align: 'center' });

    doc.moveDown(2);
    doc.font('Helvetica-Bold')
      .fontSize(36)
      .text('Certificate of Achievement', { align: 'center', underline: true });

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

    doc.moveDown(1.5);
    doc.font('Helvetica')
      .fontSize(14)
      .text('This is an authentic certificate digitally issued by CertifiedSkill.org.', { align: 'center' });
    doc.text('Visit CertifiedSkill.org.com to verify its authenticity.', { align: 'center' });

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

    doc.end();
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
