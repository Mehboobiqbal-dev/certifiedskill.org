
import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true, // Markdown or HTML content
  },
  order: {
    type: Number,
    default: 0,
  },
  originalUrl: {
    type: String,
  },
});

// Compound index to ensure slugs are unique within a category
LessonSchema.index({ category: 1, slug: 1 }, { unique: true });

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
