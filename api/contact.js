const { MongoClient } = require("mongodb");

// Reuse connection across warm invocations
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set.");

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async function handler(req, res) {
  // CORS headers — allow requests from your portfolio domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const client = await connectToDatabase();
    const db = client.db("portfolio");
    const collection = db.collection("messages");

    const doc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      receivedAt: new Date(),
      read: false,
    };

    const result = await collection.insertOne(doc);

    return res.status(200).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("MongoDB error:", err);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};
