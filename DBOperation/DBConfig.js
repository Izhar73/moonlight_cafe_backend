const { MongoClient } = require("mongodb");

let client;
let db;

const dbConfig = async () => {
  try {
    if (!client) {
      const url = process.env.MONGO_URI;  // 🔥 USE ATLAS URI
      client = new MongoClient(url);
      await client.connect();
      db = client.db("moonlight"); // ⚠ use same DB name you used in Atlas
      console.log("✅ MongoDB Connected Successfully");
    }
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

module.exports = { dbConfig };
