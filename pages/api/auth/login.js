// pages/api/auth/login.js
import dbConnect from '../../../lib/db'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'POST') {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ msg: 'Invalid credentials' })
      }
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
