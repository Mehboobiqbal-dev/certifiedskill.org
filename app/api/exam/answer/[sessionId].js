// pages/api/exam/answer/[sessionId].js
import dbConnect from '../../../../lib/db'
import ExamSession from '../../models/ExamSession'
import Question from '../../models/Question'
import exam from '../../models/exam'
import { authenticate } from '../../../../middleware/auth'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'POST') {
    const user = authenticate(req, res)
    if (!user) return
    const { sessionId } = req.query
    const { questionId, answer } = req.body
    try {
      const session = await ExamSession.findById(sessionId)
      if (!session || session.userId.toString() !== user.userId || session.status === 'completed') {
        return res.status(403).json({ msg: 'Unauthorized or exam ended' })
      }
      const question = await Question.findById(questionId)
      const isCorrect = question.correctAnswer === answer
      session.answers.push({ questionId, answer, isCorrect })
      const exam = await Exam.findById(session.examId)
      if (new Date() - session.startTime > exam.timeLimit * 60000 || session.answers.length === 5) {
        session.status = 'completed'
        session.endTime = new Date()
      }
      await session.save()
      return res.status(200).json({ next: session.status === 'ongoing' })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
