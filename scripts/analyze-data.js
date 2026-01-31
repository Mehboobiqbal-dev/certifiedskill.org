
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'w3schools_data.jsonl');

async function analyze() {
  const fileStream = fs.createReadStream(DATA_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const categories = new Set();
  let total = 0;
  let hasCodeBlock = 0;
  let sample = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    total++;
    try {
      const entry = JSON.parse(line);
      if (entry.category) categories.add(entry.category);
      
      // Basic check for code-like patterns in content
      if (entry.content && (entry.content.includes('Example') || entry.content.includes('Try it Yourself'))) {
        hasCodeBlock++;
      }

      if (!sample && entry.category === 'html') {
        sample = entry;
      }
    } catch (e) {}
  }

  const report = [];
  report.push('--- Analysis Report ---');
  report.push(`Total Documents: ${total}`);
  report.push(`Unique Categories: ${categories.size}`);
  report.push(`Categories: ${Array.from(categories).slice(0, 20).join(', ')}...`);
  report.push(`Documents with potential Code Examples: ${hasCodeBlock}`);
  report.push('\n--- Sample HTML Entry ---');
  report.push(JSON.stringify(sample, null, 2));

  fs.writeFileSync(path.join(__dirname, '..', 'analysis_report.txt'), report.join('\n'));
  console.log('Analysis saved to analysis_report.txt');
}

analyze();
