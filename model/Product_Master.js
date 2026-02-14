const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  Description: { type: String },
  Price: { type: Number, required: true },
  FileName: { type: String },
  CategoryId: { type: Number },
  Available: { type: Boolean, default: true }, // ✅ new field
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product_Master", ProductSchema);
