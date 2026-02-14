const { MongoClient } = require("mongodb");

let client;
let db;

const dbConfig = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db("moonlight"); // ⚠ Atlas DB name
    console.log("✅ MongoDB Connected Successfully");
  }
  return db;
};

module.exports = { dbConfig };
