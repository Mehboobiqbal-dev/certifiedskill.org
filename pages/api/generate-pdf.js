// pages/api/generate-pdf.js
// This file is separated to reduce serverless function size

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Only import PDF generation libraries when this endpoint is called
      const PDFDocument = (await import('pdfkit')).default;
      const fs = await import('fs');
      const path = await import('path');
      const { v4: uuidv4 } = await import('uuid');
      
      const { content, title, filename } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      // Create a unique filename if not provided
      const pdfFilename = filename || `${uuidv4()}.pdf`;
      const outputPath = path.join(process.cwd(), 'public', 'certificate', pdfFilename);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      
      // Pipe output to file
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      
      // Add content to PDF
      doc.fontSize(25).text(title || 'Generated Document', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(content);
      
      // Finalize PDF
      doc.end();
      
      // Wait for the stream to finish
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
      
      return res.status(200).json({ 
        success: true, 
        filename: pdfFilename,
        path: `/certificate/${pdfFilename}` 
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}