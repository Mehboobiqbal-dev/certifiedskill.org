const fs = require('fs');
const readline = require('readline');

async function findLine() {
  const fileStream = fs.createReadStream('w3schools_data_v4.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    try {
        const entry = JSON.parse(line);
        if (entry.title === 'HTML Attributes') {
            console.log(`Found on line ${lineNum}`);
            fs.writeFileSync('debug_attributes.json', JSON.stringify(entry, null, 2));
            break; 
        }
    } catch (e) {}
  }
}

findLine();
