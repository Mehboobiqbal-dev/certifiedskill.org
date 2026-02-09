import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../../../lib/db';

export default async function handler(req, res) {
  // Connect to the database using the same robust pattern as verify.js
  let db;
  try {
      const mongoose = require('mongoose');
      await connectToDatabase();
      
      if (mongoose.connection.readyState === 1) {
           db = mongoose.connection.db;
      } else {
           const conn = await connectToDatabase();
           db = conn.db || (conn.connection && conn.connection.db) || mongoose.connection.db;
      }
      
      if (!db) throw new Error("Could not acquire database handle");
      
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ message: 'Database connection failed' });
  }

  if (req.method === 'GET') {
    // If a certificateNumber is provided in the query string, generate the PDF.
    const { certificateNumber, userEmail, userId, format } = req.query;
    
    if (certificateNumber) {
      try {
        // Strip .pdf extension if present (happens if some clients append it to the URL)
        // Use replace with global flag or logic to handle multiple occurrences if needed,
        // but typically just one at the end.
        // Also handle cases where it might be .pdf.pdf or something odd due to redirects.
        let cleanCertificateNumber = certificateNumber.replace(/(\.pdf)+$/i, '');
        console.log(`[API/Certificates] Searching for ID: "${cleanCertificateNumber}" (Original: "${certificateNumber}")`);
        
        // Find the certificate by its certificateId - using simple query first
        let certificate = await db.collection('certificates').findOne({ certificateId: cleanCertificateNumber });
        
        if (certificate) {
             console.log(`[API/Certificates] Found certificate directly: ${certificate._id}`);
        }

        // Debug check: try to find any certificate to see structure
        if (!certificate) {
             console.log(`[API/Certificates] Direct lookup failed for "${cleanCertificateNumber}". Checking alternatives...`);
             
             // 1. Try Trimmed
             const trimmedId = cleanCertificateNumber.trim();
             if (trimmedId !== cleanCertificateNumber) {
                 console.log(`[API/Certificates] Trying trimmed ID: "${trimmedId}"`);
                 certificate = await db.collection('certificates').findOne({ certificateId: trimmedId });
             }
             
             // 2. Try Case Insensitive Regex
             if (!certificate) {
                 console.log(`[API/Certificates] Trying regex case-insensitive...`);
                 certificate = await db.collection('certificates').findOne({ certificateId: { $regex: new RegExp(`^${cleanCertificateNumber}$`, 'i') } });
             }
             
             // 3. Try to find by _id if it happens to be an ObjectId string (unlikely for uuid but possible)
             if (!certificate && cleanCertificateNumber.length === 24) {
                 const { ObjectId } = require('mongodb');
                 try {
                    certificate = await db.collection('certificates').findOne({ _id: new ObjectId(cleanCertificateNumber) });
                 } catch(e) {}
             }
        }
        
        if (!certificate) {
             console.log(`[API/Certificates] ALL Lookups failed for "${cleanCertificateNumber}"`);
             // List all IDs for debugging
             const all = await db.collection('certificates').find({}, { projection: { certificateId: 1 } }).limit(5).toArray();
             console.log("Sample IDs in DB:", all.map(c => c.certificateId));
             
             return res.status(404).json({ message: 'Certificate not found', debugId: cleanCertificateNumber });
        }
        
        // Return JSON metadata if requested
        if (format === 'json') {
            return res.status(200).json(certificate);
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
        
        let title = certificate.examName || 'Certificate of Achievement';
        // Capitalize first letter just in case
        if (title && title.length > 0) {
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        doc.font('Helvetica-Bold')
          .fontSize(36)
          .text(title, { align: 'center', underline: true });

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
        
        if (certificate.score) {
             doc.moveDown(0.5);
             doc.font('Helvetica')
               .fontSize(16)
               .text(`with a score of ${certificate.score}%`, { align: 'center' });
        }

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
    const { userId, userName, examId, examName, passed, userEmail, score } = req.body;
    
    if (passed !== true && passed !== 'true') {
      console.error('Exam not passed:', req.body);
      return res.status(400).json({ message: 'User did not pass the exam' });
    }
    
    try {
      let certificate = await db.collection('certificates').findOne({ userId, examId });
  
      if (certificate) {
        console.log('Existing certificate found:', certificate);
        // Update score if better? For now just ensure ID
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
          ...(userEmail && { userEmail }),
          ...(score && { score: Number(score) })
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
