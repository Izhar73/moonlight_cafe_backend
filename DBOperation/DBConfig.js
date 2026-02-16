const { MongoClient } = require("mongodb");

let dbInstance;

async function dbConfig() {
  if (!dbInstance) {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    dbInstance = client.db("moonlight");
    console.log("✅ MongoDB Connected");
  }
  return dbInstance;
}

module.exports = { dbConfig };
