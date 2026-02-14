const ManageCart = require("../DBOperation/ManageCart");

// ✅ Save cart
exports.saveRequest = async (req, res) => {
  try {
    const result = await ManageCart.saveCart(req.body);
    if (result.Status === "OK") {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error("❌ Error saving cart:", err);
    res.status(500).json({
      Status: "Fail",
      Message: "Internal Server Error",
      Error: err.message,
    });
  }
};

// ✅ List all carts (Admin view)
exports.listAllRequest = async (req, res) => {
  try {
    const data = await ManageCart.getCart(0); // 🔹 You can modify this if you later want to support admin filtering
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error listing all carts:", err);
    res.status(500).json({
      Status: "Fail",
      Message: "Internal Server Error",
      Error: err.message,
    });
  }
};

// ✅ Get cart by user ID
exports.listRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ManageCart.getCart(id);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error listing user cart:", err);
    res.status(500).json({
      Status: "Fail",
      Message: "Internal Server Error",
      Error: err.message,
    });
  }
};

// ✅ Get single cart by Cart ID
exports.getByIdRequest = async (req, res) => {
  try {
    const data = await ManageCart.getCartById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error getting cart by ID:", err);
    res.status(500).json({
      Status: "Fail",
      Message: "Internal Server Error",
      Error: err.message,
    });
  }
};

// ✅ Update cart quantity
exports.updateRequest = async (req, res) => {
  try {
    const result = await ManageCart.updateCart(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating cart:", err);
    res.status(500).json({
      Status: "Fail",
      Message: "Internal Server Error",
      Error: err.message,
    });
  }
};

// ✅ Delete cart
exports.deleteRequest = async (req, res) => {
  try {
    const result = await ManageCart.deleteCart(req.params.id);
    if (result.Status === "OK" || result === "success") {
      res.status(200).json({
        Status: "OK",
        Message: "Cart deleted successfully",
      });
    } else {
      res.status(400).json({
        Status: "Fail",
        Message: "Cart delete failed",
      });
    }
  } catch (err) {
    console.error("❌ Error deleting cart:", err);
    res.status(500).json({
      Status: "Fail",
      Message: "Internal Server Error",
      Error: err.message,
    });
  }
};
