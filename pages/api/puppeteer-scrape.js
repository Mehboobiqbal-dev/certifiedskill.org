// pages/api/puppeteer-scrape.js
// This file is separated from the main scrape.js to reduce serverless function size

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Only import puppeteer when this endpoint is called
      const puppeteerExtra = await import('puppeteer-extra');
      const StealthPlugin = await import('puppeteer-extra-plugin-stealth');
      
      // Configure puppeteer with stealth plugin
      puppeteerExtra.default.use(StealthPlugin.default());
      
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      // Launch browser with minimal settings
      const browser = await puppeteerExtra.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      
      try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Extract content
        const content = await page.evaluate(() => {
          const mainElement = document.querySelector('#main');
          return mainElement ? {
            title: document.querySelector('h1')?.textContent?.trim() || 'Untitled',
            html: mainElement.innerHTML
          } : null;
        });
        
        await browser.close();
        
        if (!content) {
          return res.status(404).json({ error: 'Content not found' });
        }
        
        return res.status(200).json(content);
      } catch (error) {
        await browser.close();
        throw error;
      }
    } catch (error) {
      console.error('Puppeteer scraping failed:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}