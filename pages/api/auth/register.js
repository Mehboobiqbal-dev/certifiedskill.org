// pages/api/auth/register.js
import dbConnect from '../../../lib/db'
import User from '../../models/User'



import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'POST') {
    const { email, password, name } = req.body
    try {
      let user = await User.findOne({ email })
      if (user) return res.status(400).json({ msg: 'User exists' })
      const hashedPassword = await bcrypt.hash(password, 10)
      user = new User({ email, password: hashedPassword, name })
      await user.save()
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      return res.status(200).json({ token })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
