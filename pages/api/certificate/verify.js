import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { certificateNumber } = req.query;
    if (!certificateNumber) {
      return res.status(400).json({ message: 'Certificate number is required' });
    }
    
    const connection = await connectToDatabase();
    const db = connection.db || connection.useDb('myDatabase');
    
    const certificate = await db
      .collection('certificates')
      .findOne({ certificateId: certificateNumber });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
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
      .text('CertifySkill.org', 0, 60, { align: 'center' });
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
      .text('This is an authentic certificate digitally issued by CertifySkill.org.', { align: 'center' });
    doc.text('Visit CertifySkill.org.com to verify its authenticity.', { align: 'center' });

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
