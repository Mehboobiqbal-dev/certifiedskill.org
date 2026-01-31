
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }
    }
  ],
  duration: { type: Number, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } // 1 year from now
});

const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);

const QUESTION_BANK = {
  html: [
    {
      questionText: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Multi Language"],
      correctAnswer: "Hyper Text Markup Language"
    },
    {
      questionText: "Choose the correct HTML element for the largest heading:",
      options: ["<h6>", "<head>", "<h1>", "<header>"],
      correctAnswer: "<h1>"
    },
     {
      questionText: "Which character is used to indicate an end tag?",
      options: ["*", "/", "<", "^"],
      correctAnswer: "/"
    },
    {
      questionText: "How can you make a numbered list?",
      options: ["<ul>", "<dl>", "<ol>", "<list>"],
      correctAnswer: "<ol>"
    }
  ],
  css: [
    {
      questionText: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
      correctAnswer: "Cascading Style Sheets"
    },
    {
      questionText: "Which HTML attribute is used to define inline styles?",
      options: ["class", "styles", "font", "style"],
      correctAnswer: "style"
    }
  ],
  js: [
    {
      questionText: "Inside which HTML element do we put the JavaScript?",
      options: ["<script>", "<js>", "<javascript>", "<scripting>"],
      correctAnswer: "<script>"
    },
    {
      questionText: "How do you write 'Hello World' in an alert box?",
      options: ["msg('Hello World')", "msgBox('Hello World')", "alertBox('Hello World')", "alert('Hello World')"],
      correctAnswer: "alert('Hello World')"
    }
  ],
  python: [
      {
          questionText: "What is the correct file extension for Python files?",
          options: [".py", ".pt", ".pyt", ".python"],
          correctAnswer: ".py"
      },
      {
          questionText: "How do you create a variable with the floating number 2.8?",
          options: ["x = 2.8", "x = float(2.8)", "Both the other answers are correct", "x : 2.8"],
          correctAnswer: "Both the other answers are correct"
      }
  ]
};

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Optional: Clear existing exams to avoid duplicates if running multiple times
    // await Exam.deleteMany({}); 

    for (const [key, questions] of Object.entries(QUESTION_BANK)) {
        const title = `${key.toUpperCase()} Certification Exam`;
        
        // Check if exists
        const exists = await Exam.findOne({ title: { $regex: new RegExp(key, 'i') } });
        if (exists) {
            console.log(`Exam ${title} already exists, skipping...`);
            continue;
        }

        const exam = new Exam({
            title: title,
            questions: questions,
            duration: 30,
            startTime: new Date(),
            endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });

        await exam.save();
        console.log(`Created exam: ${title}`);
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding exams:', error);
    process.exit(1);
  }
}

seed();
