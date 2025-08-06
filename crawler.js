// crawler.js
const axios = require('axios');
const cheerio = require('cheerio');

const startingUrl = 'https://www.w3schools.com/html/default.asp';
const baseUrl = 'https://www.w3schools.com/html/';
const tutorialLinks = new Set(); // Use a Set to avoid duplicate URLs

async function getTutorialLinks() {
  try {
    const response = await axios.get(startingUrl);
    const $ = cheerio.load(response.data);

    // CORRECTED SELECTOR: Use '#mySidenav a' instead of '#leftmenu a'
    $('#mySidenav a').each((index, element) => {
      const link = $(element).attr('href');
      // Also, let's filter out links that are just placeholders or external
      if (link && !link.startsWith('#') && !link.startsWith('javascript:')) {
        // Construct the full, absolute URL
        const fullUrl = new URL(link, baseUrl).href;
        tutorialLinks.add(fullUrl);
      }
    });

    console.log(`Found ${tutorialLinks.size} tutorial links:`);
    console.log(tutorialLinks);
    return Array.from(tutorialLinks);

  } catch (error) {
    console.error('Error fetching the starting URL:', error);
    return []; // Return an empty array on error
  }
}

// For testing, you can run this file directly
// In the final version, you'll export the function
getTutorialLinks();

// module.exports = { getTutorialLinks }; // You will use this for the final combined script