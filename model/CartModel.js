const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  RegisterationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registeration_Master",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product_Master",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String },
  deliveryInfo: {
    name: String,
    phone: String,
    address: String,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart_Master", CartSchema);
