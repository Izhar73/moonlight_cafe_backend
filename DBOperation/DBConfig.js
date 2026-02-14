const { MongoClient } = require("mongodb");

let client;

const dbConfig = async () => {
  if (!client) {
    const url = "mongodb://localhost:27017";
    client = new MongoClient(url);
    await client.connect();
  }
  const dbName = "MoonLight_Cafe";
  const db = client.db(dbName);
  return db;
};

module.exports = { dbConfig };
