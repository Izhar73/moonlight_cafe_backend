const ManageOrders = require("./../DBOperation/ManageOrders");
const ManageProduct = require("./../DBOperation/ManageProduct");
const ManageCategory = require("./../DBOperation/ManageCategory");

class DashboardController {

  // 📊 Get dashboard statistics
  getStats = async (req, res) => {
    try {

      // 📦 Products count
      const productsData = await ManageProduct.getAllProducts();
      const productsCount =
        productsData.Status === "OK" ? productsData.Result.length : 0;

      // 🗂 Categories count
      const categoriesData = await ManageCategory.getCategories();
      const categoriesCount =
        categoriesData.Status === "OK" ? categoriesData.Result.length : 0;

      // 🧾 Orders
      const ordersData = await ManageOrders.getAllOrders();
      const orders =
        ordersData.Status === "OK" ? ordersData.Result : [];

      const ordersCount = orders.length;

      // 💰 Total Revenue
      const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.Total || 0),
        0
      );

      // 📅 Today’s Revenue
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      const todayRevenue = orders
        .filter(order => {
          if (!order.OrderDate) return false;
          const orderDate = new Date(order.OrderDate)
            .toISOString()
            .slice(0, 10);
          return orderDate === todayStr;
        })
        .reduce((sum, order) => sum + Number(order.Total || 0), 0);

      return res.status(200).json({
        Status: "OK",
        Result: {
          productsCount,
          categoriesCount,
          ordersCount,
          totalRevenue,
          todayRevenue,
        },
      });

    } catch (error) {
      console.error("🔥 Dashboard error:", error);
      return res.status(500).json({
        Status: "Fail",
        Message: "Internal Server Error",
        Error: error.message,
      });
    }
  };
}

module.exports = new DashboardController();
