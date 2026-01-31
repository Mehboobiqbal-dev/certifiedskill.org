
import { submitExam } from '../../../lib/examService';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/authOptions";
import connectToDatabase from '../../../lib/db';
import Certificate from '../../../models/Certificate';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { examId, answers, category } = req.body;
    
    // Logic to save result to DB would go here
    // For now, using service mock
    const result = await submitExam(examId, answers);
    
    // Get user session
    const session = await getServerSession(req, res, authOptions);

    if (result.passed && session && session.user) {
        try {
            await connectToDatabase();
            
            // Check if certificate already exists for this user and exam/category
            const existingCert = await Certificate.findOne({
                userId: session.user.id,
                $or: [{ examId: examId }, { courseCategory: category }]
            });

            if (existingCert) {
                result.certificateId = existingCert.certificateId;
            } else {
                const newCertId = uuidv4();
                await Certificate.create({
                    userId: session.user.id,
                    userName: session.user.name,
                    courseCategory: category,
                    examId: examId,
                    examName: `${category} Certification Exam`,
                    certificateId: newCertId,
                    issuedAt: new Date()
                });
                result.certificateId = newCertId;
            }
        } catch (error) {
            console.error("Error creating certificate:", error);
            // Fallback to mock ID is already in result
        }
    }

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
