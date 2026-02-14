const ManageOrders = require("./../DBOperation/ManageOrders");
const ManageCart = require("./../DBOperation/ManageCart");

class OrderController {
  // 🧾 Save new order
  saveOrder = async (req, res) => {
    try {
      const response = await ManageOrders.saveOrder(req.body);

      // 🧹 Clear cart after successful order
      if (response.Status === "OK") {
        try {
          const RegisterationId = parseInt(req.body.RegisterationId);
          if (RegisterationId) {
            const cartData = await ManageCart.getCart(RegisterationId);

            if (cartData.Status === "OK" && Array.isArray(cartData.Result)) {
              for (const item of cartData.Result) {
                await ManageCart.deleteCart(item._id);
              }
              console.log(
                `🧹 Cleared ${cartData.Result.length} items from user ${RegisterationId}'s cart`
              );
            }
          }
        } catch (err) {
          console.error("⚠️ Error clearing cart after order:", err);
        }
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("❌ Error saving order:", error);
      return res.status(500).json({
        Status: "Fail",
        Message: "Internal Server Error",
        Error: error.message,
      });
    }
  };

  // 📋 List all orders (Admin view)
  listOrder = async (req, res) => {
    try {
      const response = await ManageOrders.getAllOrders();
      return res.status(200).json(response);
    } catch (error) {
      console.error("❌ Error listing orders:", error);
      return res.status(500).json({
        Status: "Fail",
        Message: "Internal Server Error",
        Error: error.message,
      });
    }
  };

  // 👤 List orders by user (User: “Your Orders” page)
  listByUserRequest = async (req, res) => {
    try {
      const userId = req.params.id;
      const response = await ManageOrders.getOrdersByUser(userId);
      return res.status(200).json({
        Status: "OK",
        Result: response,
      });
    } catch (error) {
      console.error("❌ Error listing user orders:", error);
      return res.status(500).json({
        Status: "Fail",
        Message: "Internal Server Error",
        Error: error.message,
      });
    }
  };

  // 🔄 Update order status (Admin changes -> reflect in user view)
  updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { Status } = req.body;

      if (!Status) {
        return res
          .status(400)
          .json({ Status: "Fail", Message: "Status is required" });
      }

      const result = await ManageOrders.updateOrderStatus(id, Status);

      return res.status(200).json({
        Status: "OK",
        Message: "Order status updated successfully",
        Result: result,
      });
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      return res.status(500).json({
        Status: "Fail",
        Message: "Internal Server Error",
        Error: error.message,
      });
    }
  };
}

module.exports = new OrderController();
