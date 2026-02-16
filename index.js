// -------------------------------------
// 🌙 MoonLight Cafe Backend - FINAL VERSION
// -------------------------------------

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// -------------------------------------
// ✅ MongoDB Connection (Atlas)
// -------------------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "moonlight",
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// -------------------------------------
// ✅ Middlewares
// -------------------------------------
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// -------------------------------------
// ✅ Static Folder (Images)
// -------------------------------------
app.use("/Content", express.static(path.join(__dirname, "Content")));

// -------------------------------------
// ✅ Root Route
// -------------------------------------
app.get("/", (req, res) => {
  res.json({
    Status: "OK",
    Result: "🚀 MoonLight Cafe API Running Successfully!",
  });
});

// ----------------------------------------
// 🌙 CATEGORY ROUTES (LOWERCASE ONLY)
// ----------------------------------------
app.post("/category/save", require("./Controller/CategoryController").saveRequest);
app.put("/category/update/:id", require("./Controller/CategoryController").updateRequest);
app.delete("/category/delete/:id", require("./Controller/CategoryController").deleteRequest);
app.get("/category/list", require("./Controller/CategoryController").listRequest);
app.get("/category/getbyid/:id", require("./Controller/CategoryController").getByIdRequest);
app.get("/category/list/type/:type", require("./Controller/CategoryController").listByTypeRequest);

// ----------------------------------------
// 🛍 PRODUCT ROUTES
// ----------------------------------------
app.post("/product/save", require("./Controller/ProductController").saveRequest);
app.get("/product/list", require("./Controller/ProductController").listRequest);
app.put("/product/update/:id", require("./Controller/ProductController").updateRequest);
app.delete("/product/delete/:id", require("./Controller/ProductController").deleteRequest);
app.get("/product/getbyid/:id", require("./Controller/ProductController").getByIdRequest);

// ----------------------------------------
// 👤 USER REGISTERATION ROUTES
// ----------------------------------------
app.post("/registeration/register", require("./Controller/RegisterationController").register);
app.post("/registeration/login", require("./Controller/RegisterationController").loginRequest);
app.get("/registeration/list", require("./Controller/RegisterationController").getAllUsers);

// ----------------------------------------
// 🔐 ADMIN ROUTES
// ----------------------------------------
app.post("/admin/save", require("./Controller/AdminController").saveRequest);
app.post("/admin/authentication", require("./Controller/AdminController").authenticationRequest);
app.put("/admin/changepassword", require("./Controller/AdminController").chnagePasswordRequest);
app.get("/admin/list", require("./Controller/AdminController").listRequest);
app.put("/admin/update/:id", require("./Controller/AdminController").updateRequest);
app.delete("/admin/delete/:id", require("./Controller/AdminController").deleteRequest);
app.get("/admin/getbyid/:id", require("./Controller/AdminController").getByIdRequest);

// ----------------------------------------
// 🛒 CART ROUTES
// ----------------------------------------
app.post("/cart/save", require("./Controller/CartController").saveRequest);
app.get("/cart/list", require("./Controller/CartController").listAllRequest);
app.get("/cart/list/:id", require("./Controller/CartController").listRequest);
app.get("/cart/getbyid/:id", require("./Controller/CartController").getByIdRequest);
app.put("/cart/update/:id", require("./Controller/CartController").updateRequest);
app.delete("/cart/delete/:id", require("./Controller/CartController").deleteRequest);

// ----------------------------------------
// 📦 ORDER ROUTES
// ----------------------------------------
app.post("/order/save", require("./Controller/OrderController").saveOrder);
app.get("/order/list", require("./Controller/OrderController").listOrder);
app.put("/order/updatestatus/:id", require("./Controller/OrderController").updateStatus);
app.get("/order/list/user/:id", require("./Controller/OrderController").listByUserRequest);

// ----------------------------------------
// 💬 FEEDBACK ROUTES (LOWERCASE FIXED)
// ----------------------------------------
app.post("/feedback/save", require("./Controller/FeedbackController").saveRequest);
app.get("/feedback/list", require("./Controller/FeedbackController").listRequest);
app.put("/feedback/update/:id", require("./Controller/FeedbackController").updateRequest);
app.delete("/feedback/delete/:id", require("./Controller/FeedbackController").deleteRequest);
app.get("/feedback/getbyid/:id", require("./Controller/FeedbackController").getByIdRequest);

// ----------------------------------------
// 📊 DASHBOARD ROUTE
// ----------------------------------------
app.get("/dashboard/stats", require("./Controller/DashboardController").getStats);

// ----------------------------------------
// ❗ GLOBAL ERROR HANDLER (IMPORTANT)
// ----------------------------------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    Status: "Fail",
    Result: err.message || "Internal Server Error",
  });
});

// ----------------------------------------
// 🚀 SERVER START
// ----------------------------------------
const PORT = process.env.PORT || 9600;

app.listen(PORT, () => {
  console.log(`🚀 Server started successfully on port ${PORT}`);
});
