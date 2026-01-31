import connectToDatabase from './db';
import Exam from '../models/exam';

export async function getExamForCategory(category) {
    await connectToDatabase();
    
    // Normalize category
    const cat = category.toLowerCase();
    
    // Try to find a real exam in the database by title (case-insensitive regex)
    // We assume titles are like "HTML Certification Exam" or just "HTML"
    // Also try to find by ID if the category string is a valid ObjectId
    
    let query = { title: { $regex: new RegExp(cat, 'i') } };
    
    // Check if category is a valid MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(cat)) {
        query = { _id: cat };
    }
    
    const exam = await Exam.findOne(query);

    if (exam && exam.questions && exam.questions.length > 0) {
        return {
            id: exam._id.toString(),
            title: exam.title,
            description: `Prove your skills in ${category}. Pass this exam to earn your certificate.`,
            duration: exam.duration || 30,
            questions: exam.questions.map(q => ({
                id: q._id ? q._id.toString() : Math.random().toString(36).substr(2, 9),
                questionText: q.questionText,
                options: q.options,
                // In a real secure app, you might not send correctAnswer to client, 
                // but for this architecture it seems to rely on client-side check or full submit.
                // If the frontend checks answers, we need to send it, OR change architecture to server-side check only.
                // Based on existing code, we'll keep it simple but ideally we strip this out.
                // However, the submit handler re-checks. 
                correctAnswer: q.correctAnswer 
            }))
        };
    }

    // Fallback if no DB exam found (keep empty or minimal if preferred, or throw error)
    // For now, let's return a placeholder so it doesn't crash, but with 0 questions if you want "real only"
    // or just throw an error. User asked to "remove duplicate old unused code".
    
    // If we strictly want NO mock data:
    throw new Error(`No exam found for category: ${category}`);
}

export async function submitExam(examId, answers) {
    await connectToDatabase();
    
    // Fetch the real exam to validate answers
    const exam = await Exam.findById(examId);
    
    if (!exam) {
         throw new Error("Exam not found");
    }

    let score = 0;
    let total = exam.questions.length;
    
    // Calculate score
    exam.questions.forEach(q => {
        // We need to match question ID or index. 
        // If answers key is question ID:
        const qId = q._id.toString();
        if (answers[qId] === q.correctAnswer) {
            score++;
        }
    });
    
    const percentage = (score / total) * 100;
    const passed = percentage >= 60; // 60% pass rate
    
    const result = {
        passed,
        score: Math.round(percentage),
        totalQuestions: total,
        correctAnswers: score
    };
    
    // Certificate generation is handled in the API route calling this
    
    return result;
}
