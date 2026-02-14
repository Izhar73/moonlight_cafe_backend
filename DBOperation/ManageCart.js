const { dbConfig } = require("./DBConfig");

class ManageCart {
  // ✅ Auto Increment ID
  getMaxCartID = async () => {
    const db = await dbConfig();
    const collection = db.collection("Cart_Master");
    const result = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    return (result.length > 0 ? result[0]._id : 0) + 1;
  };

  // ✅ Save Cart Item
  saveCart = async (data) => {
    try {
      const db = await dbConfig();
      const collection = db.collection("Cart_Master");
      const productCollection = db.collection("Product_Master");

      const CartId = await this.getMaxCartID();

      // 🧾 Get product details from Product_Master
      const product = await productCollection.findOne({
        _id: parseInt(data.ProductId),
      });

      if (!product) {
        return { Status: "Fail", Message: "Product not found" };
      }

      const newCartItem = {
        _id: CartId,
        RegisterationId: parseInt(data.RegisterationId) || 0,
        ProductId: parseInt(data.ProductId) || 0,
        ProductName: product.ProductName || "Unknown Product",
        FileName: product.FileName || product.Image || "",
        Quantity: parseInt(data.Quantity) || 1,
        Price: parseFloat(product.Price) || 0,
        Total:
          (parseFloat(product.Price) || 0) *
          (parseInt(data.Quantity) || 1),
        CreatedAt: new Date(),
      };

      const result = await collection.insertOne(newCartItem);
      return result.acknowledged
        ? { Status: "OK", Message: "Item added to cart", Result: newCartItem }
        : { Status: "Fail", Message: "Failed to add to cart" };
    } catch (err) {
      console.error("🔥 Error saving cart:", err);
      return { Status: "Fail", Message: "Error saving cart" };
    }
  };

  // ✅ Get Cart List (User-Specific)
  getCart = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Cart_Master");

    const data = await collection
      .aggregate([
        { $match: { RegisterationId: parseInt(id) } },
        {
          $lookup: {
            from: "Product_Master",
            localField: "ProductId",
            foreignField: "_id",
            as: "ProductDetails",
          },
        },
        { $unwind: { path: "$ProductDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            RegisterationId: 1,
            ProductId: 1,
            Quantity: 1,
            Price: 1,
            Total: 1,
            CreatedAt: 1,
            ProductName: {
              $ifNull: ["$ProductDetails.ProductName", "$ProductName"],
            },
            FileName: {
              $ifNull: ["$ProductDetails.FileName", "$FileName"],
            },
          },
        },
      ])
      .toArray();

    return { Status: "OK", Result: data };
  };

  // ✅ Get Single Cart Item
  getCartById = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Cart_Master");
    const data = await collection.findOne({ _id: parseInt(id) });
    return data
      ? { Status: "OK", Result: data }
      : { Status: "Fail", Result: "No record found" };
  };

  // ✅ Update Cart Quantity
  updateCart = async (id, data) => {
    const db = await dbConfig();
    const collection = db.collection("Cart_Master");

    const result = await collection.updateOne(
      { _id: parseInt(id) },
      {
        $set: {
          Quantity: parseInt(data.Quantity),
          Total:
            parseFloat(data.Price) * parseInt(data.Quantity) ||
            parseFloat(data.Total) ||
            0,
        },
      }
    );

    if (result.modifiedCount > 0) {
      return { Status: "OK", Result: "Cart updated successfully" };
    }
    return { Status: "Fail", Result: "Cart update failed" };
  };

  // ✅ Delete Cart Item
  deleteCart = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Cart_Master");

    const result = await collection.deleteOne({ _id: parseInt(id) });
    return result.deletedCount > 0
      ? { Status: "OK", Message: "Item deleted successfully" }
      : { Status: "Fail", Message: "Delete failed" };
  };
}

module.exports = new ManageCart();
