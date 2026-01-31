const fs = require('fs');
const readline = require('readline');

async function findLine() {
  const fileStream = fs.createReadStream('w3schools_data_v4.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
        const entry = JSON.parse(line);
        if (entry.title === 'HTML Examples') {
            console.log(`Found HTML Examples`);
            fs.writeFileSync('debug_examples.json', JSON.stringify(entry, null, 2));
            break; 
        }
    } catch (e) {}
  }
}

findLine();
