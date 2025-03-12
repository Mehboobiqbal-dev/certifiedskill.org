// pages/api/exam/start.js
import dbConnect from '../../../lib/db'
import ExamSession from '../models/ExamSession'
import Question from '../models/Question'
import { authenticate } from '../../../middleware/auth'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'POST') {
    const user = authenticate(req, res)
    if (!user) return
    const { examId } = req.body
    try {
      const questions = await Question.find({ examId }).select('-correctAnswer')
      const randomQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5)
      const session = new ExamSession({
        userId: user.userId,
        examId,
        startTime: new Date(),
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        deviceInfo: req.headers['user-agent']
      })
      await session.save()
      return res.status(200).json({ sessionId: session._id, firstQuestion: randomQuestions[0] })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
