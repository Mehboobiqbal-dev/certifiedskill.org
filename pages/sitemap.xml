// pages/sitemap.xml.js
import connectToDatabase from "../lib/db";
import Exam from "../models/exam";

function Sitemap() {
  // This component doesn’t render anything.
  return null;
}

export const getServerSideProps = async ({ res }) => {
  // Connect to your database and fetch exam documents
  await connectToDatabase();
  const exams = await Exam.find({}).lean();

  // Define your static pages as they are in your existing sitemap.
  const staticPages = [
    {
      loc: "https://certifiedskill.org/",
      priority: "1.0",
      changefreq: "daily",
      lastmod: null,
    },
    {
      loc: "https://certifiedskill.org/sign-up",
      priority: "0.8",
      changefreq: "weekly",
      lastmod: "2023-10-05",
    },
    {
      loc: "https://certifiedskill.org/sign-in",
      priority: "0.8",
      changefreq: "weekly",
      lastmod: null,
    },
    {
      loc: "https://certifiedskill.org/verify-certificate",
      priority: "0.8",
      changefreq: "weekly",
      lastmod: "2023-10-05",
    },
    {
      loc: "https://certifiedskill.org/about",
      priority: "0.5",
      changefreq: "monthly",
      lastmod: null,
    },
    {
      loc: "https://certifiedskill.org/privacy",
      priority: "0.5",
      changefreq: "monthly",
      lastmod: null,
    },
    {
      loc: "https://certifiedskill.org/careers",
      priority: "0.5",
      changefreq: "monthly",
      lastmod: null,
    },
  ];

  // Start building the XML string.
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add each static page
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${page.loc}</loc>\n`;
    if (page.lastmod) {
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add dynamic exam landing pages
  if (exams && exams.length > 0) {
    exams.forEach((exam) => {
      xml += `  <url>\n`;
      // The exam landing page URL is /exams/[id]
      xml += `    <loc>https://certifiedskill.org/exams/${exam._id.toString()}</loc>\n`;
      if (exam.updatedAt) {
        xml += `    <lastmod>${new Date(exam.updatedAt).toISOString()}</lastmod>\n`;
      }
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });
  }

  xml += `</urlset>`;

  // Set header and return the XML
  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
