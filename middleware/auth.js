// middleware/auth.js
import jwt from 'jsonwebtoken'

export function authenticate(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ msg: 'No token' })
    return null
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' })
    return null
  }
}
