const fs = require('fs');
const path = require('path');
const { topicsToScrape } = require('../../config/config.js');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const materials = topicsToScrape.map(topic => {
      const folderPath = path.join(process.cwd(), topic.folder);
      let files = [];
      if (fs.existsSync(folderPath)) {
        files = fs.readdirSync(folderPath).filter(file => file.endsWith('.md'));
      }
      return { name: topic.name, files };
    });
    res.status(200).json(materials);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}