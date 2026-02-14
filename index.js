// -------------------------------------
// ✅ MongoDB Connection (Atlas)
// -------------------------------------
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "moonlight", // ⚠ must match your Atlas database name
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// -------------------------------------
// 🌙 MoonLight Cafe Backend
// -------------------------------------
const express = require("express");
const cors = require("cors");
const path = require("path");

// 🧩 Controllers Import
const CategoryController = require("./Controller/CategoryController");
const ProductController = require("./Controller/ProductController");
const RegisterationController = require("./Controller/RegisterationController");
const LoginController = require("./Controller/LoginController");
const AdminController = require("./Controller/AdminController");
const OrderController = require("./Controller/OrderController");
const CartController = require("./Controller/CartController");
const FeedbackController = require("./Controller/FeedbackController");
const DashboardController = require("./Controller/DashboardController");

const app = express();

// -------------------------------------
// ✅ Middlewares
// -------------------------------------
app.use(express.json());
app.use(cors());

app.use(
  "/Content/Product/",
  express.static(path.join(__dirname, "Content/Product"))
);

// -------------------------------------
// ✅ Root Route
// -------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 MoonLight Cafe API Running Successfully!");
});

// ----------------------------------------
// 🌙 CATEGORY ROUTES
// ----------------------------------------
app.post("/category/save", CategoryController.saveRequest);
app.put("/category/update/:id", CategoryController.updateRequest);
app.delete("/category/delete/:id", CategoryController.deleteRequest);
app.get("/category/list", CategoryController.listRequest);
app.get("/category/getbyid/:id", CategoryController.getByIdRequest);
app.get("/category/list/:type", CategoryController.listByTypeRequest);

// ----------------------------------------
// 🛍 PRODUCT ROUTES
// ----------------------------------------
app.post("/product/save", ProductController.saveRequest);
app.get("/product/list", ProductController.listRequest);
app.put("/product/update/:id", ProductController.updateRequest);
app.delete("/product/delete/:id", ProductController.deleteRequest);
app.get("/product/getbyid/:id", ProductController.getByIdRequest);

// ----------------------------------------
// 👤 USER REGISTERATION ROUTES
// ----------------------------------------
app.post("/Registeration/register", RegisterationController.register);
app.post("/Registeration/login", RegisterationController.loginRequest);
app.get("/Registeration/list", RegisterationController.getAllUsers);

// Admin users
app.get("/admin/users", RegisterationController.getAllUsers);

// ----------------------------------------
// 🔐 LOGIN ROUTES
// ----------------------------------------
app.post("/Login/save", LoginController.saveRequest);
app.get("/Login/list", LoginController.listRequest);
app.put("/Login/update/:id", LoginController.updateRequest);
app.delete("/Login/delete/:id", LoginController.deleteRequest);
app.get("/Login/getbyid/:id", LoginController.getByIdRequest);

// ----------------------------------------
// 🛠 ADMIN ROUTES
// ----------------------------------------
app.post("/Admin/save", AdminController.saveRequest);
app.post("/Admin/Authetication", AdminController.authenticationRequest);
app.put("/Admin/ChangePassword", AdminController.chnagePasswordRequest);
app.get("/Admin/list", AdminController.listRequest);
app.put("/Admin/update/:id", AdminController.updateRequest);
app.delete("/Admin/delete/:id", AdminController.deleteRequest);
app.get("/Admin/getbyid/:id", AdminController.getByIdRequest);

// ----------------------------------------
// 🛒 CART ROUTES
// ----------------------------------------
app.post("/cart/save", CartController.saveRequest);
app.get("/cart/list", CartController.listAllRequest);
app.get("/cart/list/:id", CartController.listRequest);
app.get("/cart/getbyid/:id", CartController.getByIdRequest);
app.put("/cart/update/:id", CartController.updateRequest);
app.delete("/cart/delete/:id", CartController.deleteRequest);

// ----------------------------------------
// 📦 ORDER ROUTES
// ----------------------------------------
app.post("/order/save", OrderController.saveOrder);
app.get("/order/list", OrderController.listOrder);
app.put("/order/updateStatus/:id", OrderController.updateStatus);
app.get("/order/list/:id", OrderController.listByUserRequest);

// ----------------------------------------
// 💬 FEEDBACK ROUTES
// ----------------------------------------
app.post("/Feedback/save", FeedbackController.saveRequest);
app.get("/Feedback/list", FeedbackController.listRequest);
app.put("/Feedback/update/:id", FeedbackController.updateRequest);
app.delete("/Feedback/delete/:id", FeedbackController.deleteRequest);
app.get("/Feedback/getbyid/:id", FeedbackController.getByIdRequest);

// ----------------------------------------
// 📊 DASHBOARD ROUTE
// ----------------------------------------
app.get("/dashboard/stats", DashboardController.getStats);

// ----------------------------------------
// 🚀 SERVER START
// ----------------------------------------
const PORT = process.env.PORT || 9600;

app.listen(PORT, () => {
  console.log(`🚀 Server started successfully on port ${PORT}`);
});
