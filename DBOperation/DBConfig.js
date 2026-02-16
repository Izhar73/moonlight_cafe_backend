const { MongoClient } = require("mongodb");

let client;
let db;

const dbConfig = async () => {
  try {
    if (!client) {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is undefined");
      }

      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();

      db = client.db("moonlight"); // Must match Atlas DB name
      console.log("✅ MongoDB Connected Successfully");
    }

    return db;
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    throw error;
  }
};

module.exports = { dbConfig };
