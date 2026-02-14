const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    RegisterationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registeration_Master",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product_Master",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true }, // total order amount
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // <-- this adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Order_Master", OrderSchema);
