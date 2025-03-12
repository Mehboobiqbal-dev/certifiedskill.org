// pages/api/exam/question/[sessionId].js
import dbConnect from '../../../../lib/db'
import ExamSession from '../../models/ExamSession'
import Question from '../../models/Question'
import { authenticate } from '../../../../middleware/auth'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'GET') {
    const user = authenticate(req, res)
    if (!user) return
    const { sessionId } = req.query
    try {
      const session = await ExamSession.findById(sessionId)
      if (!session || session.userId.toString() !== user.userId) {
        return res.status(403).json({ msg: 'Unauthorized' })
      }
      const questions = await Question.find({ examId: session.examId }).select('-correctAnswer')
      const answered = session.answers.length
      if (answered >= questions.length) {
        return res.status(200).json({ msg: 'Exam completed' })
      }
      return res.status(200).json(questions[answered])
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
