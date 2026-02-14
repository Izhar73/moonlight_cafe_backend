{/*const { dbConfig } = require("./DBConfig");

class ManageOrder {
  // 🔹 Generate Auto Increment Order ID
  getmaxOrderID = async () => {
    const db = await dbConfig();
    const collection = db.collection("Order_Master");
    const result = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    const ID = (result.length > 0 ? result[0]._id : 0) + 1;
    console.log("🧾 Generated Order ID:", ID);
    return ID;
  };

  // 🔹 Save New Order
  saveOrder = async (data) => {
    try {
      const db = await dbConfig();
      const orderCollection = db.collection("Order_Master");
      const categoryCollection = db.collection("Category_Master");
      const productCollection = db.collection("Product_Master");

      const OrderId = await this.getmaxOrderID();

      // ✅ Validate category
      const category = await categoryCollection.findOne({
        _id: parseInt(data.categoryId),
      });
      if (!category) {
        console.log("❌ Invalid categoryId:", data.categoryId);
        return "Invalid categoryId";
      }

      // ✅ Validate product
      const product = await productCollection.findOne({
        _id: parseInt(data.productId),
      });
      if (!product) {
        console.log("❌ Invalid productId:", data.productId);
        return "Invalid productId";
      }

      // ✅ Insert new order
      const result = await orderCollection.insertOne({
        _id: OrderId,
        Orderdate: data.Orderdate || new Date(),
        categoryId: parseInt(data.categoryId),
        productId: parseInt(data.productId),
        Total_Amount: parseFloat(data.Total_Amount),
        Payment_Mode: data.Payment_Mode,
        Status: data.Status,
        created_at: new Date(),
      });

      if (result.acknowledged) {
        console.log("✅ Order saved successfully:", OrderId);
        return {
          Status: "OK",
          Message: "Order saved successfully",
          OrderId,
        };
      } else {
        console.log("⚠️ Mongo insert not acknowledged");
        return "Failed";
      }
    } catch (error) {
      console.error("❌ Error in saveOrder:", error);
      return "Failed";
    }
  };

  // 🔹 Get All Orders
  getOrder = async () => {
  const db = await dbConfig();
  const collection = db.collection("Order_Master");
  const productCollection = db.collection("Product_Master");
  const categoryCollection = db.collection("Category_Master");

  // Join with Product and Category to show names
  const orders = await collection
    .aggregate([
      {
        $lookup: {
          from: "Product_Master",
          localField: "productId",
          foreignField: "_id",
          as: "Product",
        },
      },
      { $unwind: { path: "$Product", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "Category_Master",
          localField: "categoryId",
          foreignField: "_id",
          as: "Category",
        },
      },
      { $unwind: { path: "$Category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          Orderdate: 1,
          Total_Amount: 1,
          Payment_Mode: 1,
          Status: 1,
          "Product.ProductName": 1,
          "Category.CategoryName": 1,
        },
      },
    ])
    .toArray();

  console.log("📦 Orders fetched:", orders.length);
  return orders;
};


  // 🔹 Get Order By ID
  getOrderById = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Order_Master");
    const order = await collection.findOne({ _id: parseInt(id) });
    return order || "No order found";
  };

  // 🔹 Update Order
  updateOrder = async (id, data) => {
    const db = await dbConfig();
    const collection = db.collection("Order_Master");

    const result = await collection.updateOne(
      { _id: parseInt(id) },
      {
        $set: {
          Orderdate: data.Orderdate || new Date(),
          categoryId: parseInt(data.categoryId),
          productId: parseInt(data.productId),
          Total_Amount: parseFloat(data.Total_Amount),
          Payment_Mode: data.Payment_Mode,
          Status: data.Status,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Order updated successfully:", id);
      return { Status: "OK", Message: "Order updated successfully" };
    } else {
      console.log("⚠️ No changes made for order:", id);
      return { Status: "Fail", Message: "No record updated" };
    }
  };

  // 🔹 Delete Order
  deleteOrder = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Order_Master");

    const result = await collection.deleteOne({ _id: parseInt(id) });

    if (result.deletedCount > 0) {
      console.log("🗑 Order deleted successfully:", id);
      return "success";
    } else {
      console.log("⚠️ No record found to delete:", id);
      return "no record found";
    }
  };
}

module.exports = new ManageOrder();
*/}