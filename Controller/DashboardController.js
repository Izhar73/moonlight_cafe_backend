// src/controllers/dashboardController.js
import { db } from "../firebase_config.js";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

class DashboardController {
  async getStats(req, res) {
    try {
      // References
      const productsCol = collection(db, "Product_Master");
      const categoriesCol = collection(db, "Category_Master");
      const ordersCol = collection(db, "Orders");

      // Fetch all products, categories, orders
      const [productsSnap, categoriesSnap, ordersSnap] = await Promise.all([
        getDocs(productsCol),
        getDocs(categoriesCol),
        getDocs(ordersCol),
      ]);

      const productsCount = productsSnap.size;
      const categoriesCount = categoriesSnap.size;
      const orders = ordersSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      const ordersCount = orders.length;

      // Total Revenue
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.Total || 0), 0);

      // Today’s Revenue
      const today = new Date();
      const todayDateStr = today.toISOString().slice(0, 10);

      const todayRevenue = orders
        .filter(o => {
          if (!o.OrderDate) return false;

          const orderDate = o.OrderDate.seconds
            ? new Date(o.OrderDate.seconds * 1000)
            : new Date(o.OrderDate);
          return orderDate.toISOString().slice(0, 10) === todayDateStr;
        })
        .reduce((sum, o) => sum + Number(o.Total || 0), 0);

      return res.status(200).json({
        Status: "OK",
        Result: { productsCount, categoriesCount, ordersCount, totalRevenue, todayRevenue },
      });
    } catch (error) {
      console.error("🔥 Dashboard error:", error);
      return res.status(500).json({ Status: "Fail", Message: error.message });
    }
  }
}

export default new DashboardController();
