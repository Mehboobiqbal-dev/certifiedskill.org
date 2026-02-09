
import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String, 
    required: true
  },
  courseCategory: {
    type: String,
    required: false,
  },
  examId: {
    type: String,
    required: false,
  },
  examName: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
