// pages/api/careers.js

import connectToDatabase from "../../lib/db"; // your MongoDB connection helper

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, role, message } = req.body;

    // Basic validation
    if (!name || !email || !role || !message) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    try {
      const { db } = await connectToDatabase();

      // Insert the application into a 'volunteerApplications' collection
      await db.collection("volunteerApplications").insertOne({
        name,
        email,
        role,
        message,
        appliedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: "Thank you for your application. We will get in touch with you shortly."
      });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Server error. Please try again later." });
    }
  }

  // If not a POST request, return a 405 Method Not Allowed response.
  res.status(405).json({ error: "Method not allowed." });
}
