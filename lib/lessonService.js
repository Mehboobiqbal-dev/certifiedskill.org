
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const DATA_FILE = path.join(process.cwd(), 'w3schools_data.jsonl');

export async function getAllCategories() {
  const categories = new Set();
  const fileStream = fs.createReadStream(DATA_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      let cat = entry.category;
      if (!cat) {
          const parts = entry.url.split('/');
          if (parts.length > 3) cat = parts[3];
      }
      if (cat) {
        categories.add(cat.toLowerCase().trim());
      }
    } catch (e) {}
  }
  return Array.from(categories);
}

// ... existing helper functions ...
// (Helper to normalize slug/category)
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export async function getLesson(category, slug) {
  const fileStream = fs.createReadStream(DATA_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      
      // Determine category (simple heuristic)
      let cat = entry.category;
      if (!cat) {
          const parts = entry.url.split('/');
          if (parts.length > 3) cat = parts[3];
      }
      cat = (cat || 'general').toLowerCase().trim();

      // Determine slug
      let s = '';
      if (entry.url.endsWith('default.asp') || entry.url.endsWith('/')) {
        s = 'introduction';
      } else {
        s = entry.url.split('/').pop().replace('.asp', '').replace('.php', '');
      }
      s = s.toLowerCase();

      if (cat === category && s === slug) {
        return {
            ...entry,
            category: cat, // ensure normalized
            slug: s
        };
      }
    } catch (e) {}
  }
  return null;
}

export async function getCategoryLessons(category) {
   const lessons = [];
   const fileStream = fs.createReadStream(DATA_FILE);
   const rl = readline.createInterface({
     input: fileStream,
     crlfDelay: Infinity
   });
 
   for await (const line of rl) {
     if (!line.trim()) continue;
     try {
       const entry = JSON.parse(line);
       
       let cat = entry.category;
        if (!cat) {
            const parts = entry.url.split('/');
            if (parts.length > 3) cat = parts[3];
        }
        cat = (cat || 'general').toLowerCase().trim();

       if (cat === category) {
         let s = '';
         if (entry.url.endsWith('default.asp') || entry.url.endsWith('/')) {
           s = 'introduction';
         } else {
           s = entry.url.split('/').pop().replace('.asp', '').replace('.php', '');
         }
         s = s.toLowerCase();

         lessons.push({
             title: entry.title,
             slug: s,
             category: cat
         });
       }
     } catch (e) {}
   }
   return lessons;
}
