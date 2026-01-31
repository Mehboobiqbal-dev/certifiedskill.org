
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Schema definition inline to avoid module import issues in standalone script
const LessonSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  content: String,
  order: Number,
  originalUrl: String,
});
LessonSchema.index({ category: 1, slug: 1 }, { unique: true });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const DATA_FILE = path.join(__dirname, '..', 'w3schools_data.jsonl');

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing lessons? Maybe not, better to upsert.
    // await Lesson.deleteMany({}); 

    const fileStream = fs.createReadStream(DATA_FILE);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let count = 0;
    
    // We need to track order per category
    const categoryCounts = {};

    for await (const line of rl) {
      if (!line.trim()) continue;
      
      try {
        const entry = JSON.parse(line);
        // Normalize data
        let { url, title, category, content } = entry;
        
        if (!category) {
            // Try to infer category from URL
            // e.g., https://www.w3schools.com/html/default.asp -> html
            const parts = url.split('/');
            if (parts.length > 3) {
                category = parts[3];
            }
        }
        
        category = category.toLowerCase().trim();
        if (!category) category = 'general';

        // Create a slug from the title or url
        let slug = '';
        if (url.endsWith('default.asp') || url.endsWith('/')) {
            slug = 'introduction';
        } else {
            const filename = url.split('/').pop().replace('.asp', '').replace('.php', '');
            slug = filename;
        }

        // Cleanup slug
        slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        if (!categoryCounts[category]) categoryCounts[category] = 0;
        const order = categoryCounts[category]++;

        await Lesson.findOneAndUpdate(
          { category, slug },
          {
            title,
            content,
            order,
            originalUrl: url
          },
          { upsert: true, new: true }
        );
        
        count++;
        if (count % 100 === 0) console.log(`Processed ${count} lessons...`);

      } catch (err) {
        console.error('Error processing line:', err);
      }
    }

    console.log(`Seeding complete! Processed ${count} documents.`);
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
