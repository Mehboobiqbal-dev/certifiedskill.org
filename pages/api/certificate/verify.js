import PDFDocument from 'pdfkit';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { certificateNumber } = req.query;
    if (!certificateNumber) {
      return res.status(400).json({ message: 'Certificate number is required' });
    }
    
    // Connect to the database and fetch the certificate details
    const connection = await connectToDatabase();
    const db = connection.db || connection.useDb('myDatabase');
    const certificate = await db
      .collection('certificates')
      .findOne({ certificateId: certificateNumber });
      
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Set up response headers to output a PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');

    // Create a new PDF document with landscape A4 dimensions
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    doc.pipe(res);

    const { width, height } = doc.page;

    // -----------------------------
    // Background & Borders
    // -----------------------------
    // White background
    doc.rect(0, 0, width, height).fill('#ffffff');

    // Outer red border
    doc.rect(30, 30, width - 60, height - 60)
       .lineWidth(5)
       .stroke('#D32F2F');

    // Inner dark border
    doc.rect(50, 50, width - 100, height - 100)
       .lineWidth(2)
       .stroke('#333333');

    // -----------------------------
    // Decorative Corner Designs
    // -----------------------------
    const drawCornerDesign = (startX, startY, endX, endY) => {
      // Bold red line
      doc.lineWidth(10)
         .strokeColor('#D32F2F')
         .moveTo(startX, startY)
         .lineTo(endX, endY)
         .stroke();
      // Overlaid black line
      doc.lineWidth(7)
         .strokeColor('#333333')
         .moveTo(startX + 10, startY)
         .lineTo(endX + 10, endY)
         .stroke();
      // Fine gold line
      doc.lineWidth(2)
         .strokeColor('#FFD700')
         .moveTo(startX + 20, startY)
         .lineTo(endX + 20, endY)
         .stroke();
    };

    // Draw designs on all four corners
    drawCornerDesign(50, 50, 150, 150); // Top-left
    drawCornerDesign(width - 150, 50, width - 50, 150); // Top-right
    drawCornerDesign(50, height - 50, 150, height - 150); // Bottom-left
    drawCornerDesign(width - 150, height - 50, width - 50, height - 150); // Bottom-right

    // -----------------------------
    // Certificate Text Content
    // -----------------------------
    // Company Header
    doc.font('Helvetica-Bold')
       .fontSize(22)
       .fillColor('#333333')
       .text('GetCertified', 0, 60, { align: 'center' });

    // Main Title
    doc.font('Times-Bold')
       .fontSize(38)
       .fillColor('#D32F2F')
       .text('Certificate of Achievement', 0, 120, { align: 'center' });

    // Subheading text
    doc.font('Helvetica')
       .fontSize(16)
       .fillColor('#333333')
       .text('This certificate is awarded to', 0, 180, { align: 'center' });

    // Recipient’s Name (dynamically fetched)
    doc.font('Helvetica-Bold')
       .fontSize(30)
       .fillColor('#000000')
       .text(certificate.userName, 0, 230, { align: 'center' });

    // Achievement Details
    doc.font('Helvetica')
       .fontSize(14)
       .fillColor('#333333')
       .text('In recognition of outstanding performance and dedication.', 0, 280, { align: 'center' });

    // -----------------------------
    // Date & Signature Sections
    // -----------------------------
    const issuedOn = new Date(certificate.issuedAt).toLocaleDateString();
    // Date on the lower left
    doc.font('Helvetica')
       .fontSize(12)
       .fillColor('#333333')
       .text(`Date: ${issuedOn}`, 60, height - 120);

    // Signature line on the lower right
    doc.moveTo(width - 220, height - 120)
       .lineTo(width - 70, height - 120)
       .stroke('#333333');
    doc.font('Helvetica')
       .fontSize(12)
       .text('Authorized Signature', width - 200, height - 110);

    // -----------------------------
    // Central Seal with Gradient
    // -----------------------------
    const sealDiameter = 100;
    const sealX = width / 2 - sealDiameter / 2;
    const sealY = height - 200;

    // Draw a gradient-filled seal by layering concentric circles
    doc.save();
    const gradientSteps = 20;
    const startColor = [184, 134, 11]; // Dark goldenrod
    const endColor = [255, 215, 0];      // Gold
    for (let i = 0; i < gradientSteps; i++) {
      const radius = (sealDiameter / 2) - (i * (sealDiameter / 2) / gradientSteps);
      const ratio = i / (gradientSteps - 1);
      const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
      const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
      const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
      doc.circle(sealX + sealDiameter / 2, sealY + sealDiameter / 2, radius)
         .fillColor(`rgb(${r},${g},${b})`)
         .fill();
    }
    doc.restore();

    // Outer circle around the seal for definition
    doc.lineWidth(4)
       .strokeColor('#C28840')
       .circle(sealX + sealDiameter / 2, sealY + sealDiameter / 2, sealDiameter / 2)
       .stroke();

    // Seal text
    doc.font('Times-Bold')
       .fontSize(14)
       .fillColor('#4B3D00')
       .text('BEST AWARD', sealX, sealY + 30, { width: sealDiameter, align: 'center' });
    doc.font('Times-Italic')
       .fontSize(10)
       .fillColor('#4B3D00')
       .text('Official Seal', sealX, sealY + 50, { width: sealDiameter, align: 'center' });

    // Finalize and send the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
