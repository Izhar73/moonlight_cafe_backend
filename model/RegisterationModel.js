const mongoose = require("mongoose");

const RegisterationSchema = new mongoose.Schema({
  FullName: { type: String, required: true },
  ContactNo: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Address: { type: String, required: true },
  UserName: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Registeration_Master", RegisterationSchema);
