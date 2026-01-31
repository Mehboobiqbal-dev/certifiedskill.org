// pages/api/scrape.js

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const topicsToScrape = require('../../config/config.js');

// --- Crawler Logic ---
async function getTutorialLinks(gotScraping, topic) {
  const { name, url, baseUrl } = topic;
  const tutorialLinks = new Set();
  console.log(`Crawling links from: ${url}`);

  try {
    const response = await gotScraping({ url: url, timeout: { request: 15000 } });
    const $ = cheerio.load(response.body);

    $('#mySidenav a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && !link.includes('javascript:void(0)')) {
        const fullUrl = new URL(link, baseUrl).href;
        tutorialLinks.add(fullUrl);
      }
    });

    console.log(`Found ${tutorialLinks.size} links for ${name}.`);
    return Array.from(tutorialLinks);

  } catch (error) {
    console.error(`Error crawling ${url}: ${error.message}`);
    return [];
  }
}

// --- Scraper Logic ---
async function scrapePage(gotScraping, url) {
  try {
    const response = await gotScraping({ url: url, timeout: { request: 15000 } });
    const $ = cheerio.load(response.body);

    const mainElement = $('#main');
    if (mainElement.length === 0) return null;

    const title = mainElement.find('h1').text().trim() || 'Untitled';
    const content = mainElement.html();
    
    return { title, url, content };

  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { gotScraping } = await import('got-scraping');

      for (const topic of topicsToScrape) {
        console.log(`\n----- Starting scrape for: ${topic.name} -----`);
        const links = await getTutorialLinks(gotScraping, topic);

        if (!links || links.length === 0) {
          console.log(`Could not find links for ${topic.name}. The site may require a full browser (Puppeteer).`);
          continue;
        }

        const outputDir = topic.folder;
        fs.mkdirSync(outputDir, { recursive: true });

        for (const link of links) {
          const data = await scrapePage(gotScraping, link);
          if (data && data.title) {
            const filename = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            const filePath = path.join(outputDir, filename);
            if (!fs.existsSync(filePath)) {
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
              console.log(`✅ Saved new: ${data.title}`);
            } else {
              console.log(`📄 Already exists: ${data.title}`);
            }
          } else {
            console.log(`❌ Failed: ${link}`);
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Procedural generation of new exam questions
      const generatedDir = path.join(__dirname, '..', '..', 'generated_exams');
      fs.mkdirSync(generatedDir, { recursive: true });
      const examId = Date.now();
      const generatedExam = generateExamQuestions(topicsToScrape); // Implement this function
      fs.writeFileSync(path.join(generatedDir, `exam_${examId}.json`), JSON.stringify(generatedExam, null, 2));
      console.log(`✅ Generated new exam: exam_${examId}.json`);

      console.log("\n----- All scraping and generation complete! -----");
      res.status(200).json({ message: 'Scraping and generation completed successfully!', newExam: `exam_${examId}.json` });
    } catch (error) {
      console.error('Process failed:', error);
      res.status(500).json({ message: 'Process failed', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateExamQuestions(topics) {
  // Simple rule-based generation: For demo, create dummy questions
  // In reality, parse scraped content to generate real questions
  const questions = [];
  topics.forEach(topic => {
    questions.push({
      question: `What is the basic concept of ${topic.name}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 'Option A'
    });
  });
  return { title: 'Generated Exam', questions };
}