const { dbConfig } = require("./DBConfig");

class ManageOrders {
  // 🧾 Save New Order
  async saveOrder(data) {
    try {
      const db = await dbConfig();
      const orderCollection = db.collection("Order_Master");
      const productCollection = db.collection("Product_Master");

      const lastOrder = await orderCollection.find({}).sort({ _id: -1 }).limit(1).toArray();
      const nextId = (lastOrder[0]?._id || 0) + 1;

      const orderItems = Array.isArray(data.OrderItems) ? data.OrderItems : [];

      const enrichedItems = await Promise.all(
        orderItems.map(async (item) => {
          const product =
            (await productCollection.findOne({ _id: parseInt(item.ProductId) })) ||
            (await productCollection.findOne({ _id: item.ProductId })) ||
            null;

          return {
            ProductId: parseInt(item.ProductId) || 0,
            ProductName: product?.ProductName || item.ProductName || "Unknown Product",
            FileName: product?.FileName || item.FileName || "",
            Quantity: parseInt(item.Quantity) || 1,
            Price: parseFloat(product?.Price || item.Price || 0),
            Total:
              parseFloat(product?.Price || item.Price || 0) * (parseInt(item.Quantity) || 1),
          };
        })
      );

      const totalAmount = enrichedItems.reduce((acc, cur) => acc + cur.Total, 0);

      const newOrder = {
        _id: nextId,
        RegisterationId: parseInt(data.RegisterationId) || 0,
        OrderItems: enrichedItems,
        Total: totalAmount,
        PaymentMethod: data.PaymentMethod || "COD",
        DeliveryInfo: {
          name: data.DeliveryInfo?.name || "",
          phone: data.DeliveryInfo?.phone || "",
          address: data.DeliveryInfo?.address || "",
          // 📍 location data (latitude, longitude)
          location: data.DeliveryInfo?.location || null,
        },
        OrderDate: new Date(),
        Status: "Pending",
      };

      const result = await orderCollection.insertOne(newOrder);

      if (result.acknowledged) {
        return { Status: "OK", Message: "Order saved successfully", Result: newOrder };
      } else {
        return { Status: "Fail", Message: "Failed to save order" };
      }
    } catch (error) {
      console.error("🔥 Error saving order:", error);
      return { Status: "Fail", Message: error.message };
    }
  }

  // 📋 Get All Orders (Admin)
  async getAllOrders() {
    try {
      const db = await dbConfig();
      const orderCollection = db.collection("Order_Master");
      const userCollection = db.collection("Registeration_Master");
      const productCollection = db.collection("Product_Master");

      const orders = await orderCollection.find({}).sort({ _id: -1 }).toArray();

      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const user = await userCollection.findOne({
            _id: parseInt(order.RegisterationId),
          });

          const enrichedItems = await Promise.all(
            (order.OrderItems || []).map(async (item) => {
              const product =
                (await productCollection.findOne({ _id: parseInt(item.ProductId) })) ||
                (await productCollection.findOne({ _id: item.ProductId })) ||
                null;

              return {
                ProductId: item.ProductId,
                ProductName: product?.ProductName || item.ProductName || "Unknown Product",
                FileName: product?.FileName || item.FileName || "",
                Quantity: item.Quantity,
                Price: item.Price,
                Total: item.Total,
              };
            })
          );

          return {
            ...order,
            OrderItems: enrichedItems,
            UserDetails: user
              ? {
                  FullName: user.FullName,
                  Email: user.Email,
                  ContactNo: user.ContactNo,
                }
              : {},
          };
        })
      );

      return { Status: "OK", Result: enrichedOrders };
    } catch (error) {
      console.error("🔥 Error in getAllOrders:", error);
      return { Status: "Fail", Message: error.message };
    }
  }

  // 🔄 Update Order Status (Admin changes -> reflected for User)
  async updateOrderStatus(orderId, newStatus) {
    try {
      const db = await dbConfig();
      const orderCollection = db.collection("Order_Master");

      const result = await orderCollection.updateOne(
        { _id: parseInt(orderId) },
        { $set: { Status: newStatus } }
      );

      if (result.modifiedCount > 0) {
        return { Status: "OK", Message: "Order status updated successfully" };
      } else {
        return { Status: "Fail", Message: "No order found or no changes made" };
      }
    } catch (error) {
      console.error("🔥 Error updating order status:", error);
      return { Status: "Fail", Message: error.message };
    }
  }

  // 👤 Get Orders by User (User “Your Orders” page)
  async getOrdersByUser(userId) {
    try {
      const db = await dbConfig();
      const orderCollection = db.collection("Order_Master");
      const productCollection = db.collection("Product_Master");

      const orders = await orderCollection
        .find({ RegisterationId: parseInt(userId) })
        .sort({ _id: -1 })
        .toArray();

      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const items = await Promise.all(
            (order.OrderItems || []).map(async (item) => {
              const product =
                (await productCollection.findOne({ _id: parseInt(item.ProductId) })) ||
                (await productCollection.findOne({ _id: item.ProductId })) ||
                null;

              return {
                ProductId: item.ProductId,
                ProductName: product?.ProductName || item.ProductName || "Unknown Product",
                FileName: product?.FileName || item.FileName || "",
                Quantity: item.Quantity,
                Price: item.Price,
                Total: item.Total,
              };
            })
          );

          return {
            ...order,
            OrderItems: items,
          };
        })
      );

      return enrichedOrders;
    } catch (error) {
      console.error("🔥 Error in getOrdersByUser:", error);
      return [];
    }
  }
}

module.exports = new ManageOrders();
