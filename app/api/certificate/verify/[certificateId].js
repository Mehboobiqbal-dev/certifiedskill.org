// pages/api/certificate/verify/[certificateId].js
import dbConnect from '../../../../lib/db'
import Certificate from '../../models/Certificate'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'GET') {
    const { certificateId } = req.query
    try {
      const certificate = await Certificate.findOne({ certificateId }).populate('userId examId')
      if (!certificate) return res.status(404).json({ msg: 'Certificate not found' })
      return res.status(200).json({
        user: certificate.userId.name,
        exam: certificate.examId.title,
        issuedAt: certificate.issuedAt
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
