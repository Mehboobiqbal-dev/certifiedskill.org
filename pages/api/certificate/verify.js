import PDFDocument from 'pdfkit';
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
    const certificate = await db.collection('certificates').findOne({ certificateNumber });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Set headers to serve a PDF directly.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
    
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    doc.pipe(res);
    
    // --- Regenerate the certificate design using stored details ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f9f9f9');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(4)
      .stroke('#003366');
    
    doc.fillColor('#003366')
       .fontSize(48)
       .text('Certificate of Achievement', { align: 'center', underline: true });
    doc.moveDown(1.5);
    
    doc.fontSize(32)
       .text('This certifies that', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(40)
       .text(certificate.userName, { align: 'center' });
    doc.moveDown(1);
    
    doc.fontSize(28)
       .text('has successfully passed the exam for', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(36)
       .text(certificate.examName, { align: 'center' });
    doc.moveDown(1.5);
    
    doc.fontSize(20)
       .text(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, { align: 'center' })
       .moveDown(0.5)
       .text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'center' });
    
    doc.end();
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
