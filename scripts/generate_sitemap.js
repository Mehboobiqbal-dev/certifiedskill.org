const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const BASE_URL = 'https://certifiedskill.org';
const DATA_FILE = path.join(process.cwd(), 'w3schools_data.jsonl');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

// Static routes
const STATIC_ROUTES = [
    '',
    '/dashboard',
    '/faq-tc',
    '/careers',
    '/contact',
    '/about',
    '/team',
    '/blog',
    '/learn',
    '/verify-certificate'
];

async function generateSitemap() {
    console.log('Generating sitemap...');
    const urls = [];

    // Add static routes
    STATIC_ROUTES.forEach(route => {
        urls.push(`${BASE_URL}${route}`);
    });

    // Process dynamic lessons
    if (fs.existsSync(DATA_FILE)) {
        const fileStream = fs.createReadStream(DATA_FILE);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const seenUrls = new Set();

        for await (const line of rl) {
            try {
                if (!line.trim()) continue;
                const entry = JSON.parse(line);
                
                // Determine Category
                let category = 'general';
                if (entry.category) category = entry.category;
                else if (entry.url) {
                    const parts = entry.url.split('/');
                    if (parts.length > 3) category = parts[3];
                }
                
                // Determine Slug (match lessonService.js logic)
                let slug = '';
                if (entry.url.endsWith('default.asp') || entry.url.endsWith('/')) {
                    slug = 'introduction';
                } else {
                    slug = entry.url.split('/').pop().replace('.asp', '').replace('.php', '');
                }
                slug = slug.toLowerCase();
                category = category.toLowerCase();

                // Construct Route
                // /learn/[category]/[slug]
                const route = `/learn/${category}/${slug}`;
                const fullUrl = `${BASE_URL}${route}`;

                if (!seenUrls.has(fullUrl)) {
                   urls.push(fullUrl);
                   seenUrls.add(fullUrl);
                }

                // Also ensure we have the category page itself
                const catUrl = `${BASE_URL}/learn/${category}`;
                if (!seenUrls.has(catUrl)) {
                    urls.push(catUrl);
                    seenUrls.add(catUrl);
                }

            } catch (e) {
                console.warn('Skipping malformed line');
            }
        }
    } else {
        console.error(`Data file not found at ${DATA_FILE}`);
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(OUTPUT_FILE, xml);
    console.log(`Sitemap generated with ${urls.length} URLs at ${OUTPUT_FILE}`);
}

generateSitemap();
