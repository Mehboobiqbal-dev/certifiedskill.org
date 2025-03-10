// pages/api/certificate/generate/[sessionId].js
import dbConnect from '../../../../lib/db'
import ExamSession from '../../models/ExamSession'
import Certificate from '../../models/Certificate'
import User from '../../models/User'
import PDFDocument from 'pdfkit'
import { authenticate } from '../../../../middleware/auth'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'GET') {
    const user = authenticate(req, res)
    if (!user) return
    const { sessionId } = req.query
    try {
      const session = await ExamSession.findById(sessionId).populate('examId')
      if (!session || session.userId.toString() !== user.userId || session.status !== 'completed') {
        return res.status(403).json({ msg: 'Invalid session' })
      }
      const correctAnswers = session.answers.filter(a => a.isCorrect).length
      if (correctAnswers < 3) return res.status(400).json({ msg: 'Did not pass' })
      const userData = await User.findById(user.userId)
      const certificateId = `${session._id}-${Date.now()}`
      const certificate = new Certificate({ userId: user.userId, examId: session.examId._id, certificateId })
      await certificate.save()
      
      res.setHeader('Content-Type', 'application/pdf')
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=certificate.pdf'
      })
      const doc = new PDFDocument()
      doc.pipe(res)
      doc.text(`Certificate of Completion\n${userData.name}\n${session.examId.title}\nID: ${certificateId}`)
      doc.end()
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
