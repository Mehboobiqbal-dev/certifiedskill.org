// models/User.js
import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Examiner', 'Candidate'], default: 'Candidate' },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// Prevent model overwrite upon hot-reloading in development
export default mongoose.models.User || mongoose.model('User', UserSchema)
