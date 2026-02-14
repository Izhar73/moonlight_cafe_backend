const manageProduct = require("./../DBOperation/ManageProduct");
const { UploadFile } = require("./../Repositories/FileUploads");
const { dbConfig } = require("./../DBOperation/DBConfig");

class ProductController {
  // ✅ Generate Unique File Name
  getUniqueFileName = (originalName = "file", extension = "") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e6);
    const ext = extension.startsWith(".") ? extension : `.${extension}`;
    return `${originalName}_${timestamp}_${random}${ext}`;
  };

  // ✅ Save Product
  saveRequest = async (req, res) => {
    try {
      const { ProductName, Description, Price, Status, base64, CategoryId, Available } = req.body;

      const errors = [];
      if (!ProductName) errors.push("ProductName is required");
      if (!Description) errors.push("Description is required");
      if (Price == null) errors.push("Price is required");

      if (errors.length > 0) {
        return res.status(400).json({ Status: "Fail", Result: errors });
      }

      const fileName = this.getUniqueFileName("Img", "png");
      UploadFile(base64, "Product/", fileName);

      // Save to DB via ManageProduct
      const result = await manageProduct.saveProduct(
        { ...req.body, Available: Available ?? true }, // ✅ Default true if not passed
        fileName
      );

      if (result === "success") {
        return res.status(200).json({ Status: "OK", Result: "Successfully Saved" });
      }

      return res.status(400).json({ Status: "Fail", Result: result });
    } catch (err) {
      console.error("❌ saveRequest error:", err);
      return res.status(500).json({ Status: "Fail", Result: err.message });
    }
  };

  // ✅ Get All Products (with Category Name)
  listRequest = async (req, res) => {
    try {
      const data = await manageProduct.getProducts();
      return res.status(200).json({
        Status: "OK",
        Result: data,
      });
    } catch (err) {
      console.error("❌ listRequest error:", err);
      return res.status(500).json({ Status: "Fail", Result: err.message });
    }
  };

  // ✅ Get Product by ID
  getByIdRequest = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ Status: "Fail", Result: "Id is required" });
      }

      const result = await manageProduct.getProductById(id);

      if (result && result !== "No Product Found") {
        return res.status(200).json({ Status: "OK", Result: result });
      } else {
        return res.status(404).json({ Status: "Fail", Result: "Record Not Found" });
      }
    } catch (err) {
      console.error("❌ getByIdRequest error:", err);
      return res.status(500).json({ Status: "Fail", Result: err.message });
    }
  };

  // ✅ Delete Product
  deleteRequest = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ Status: "Fail", Result: "Id is required" });
      }

      const result = await manageProduct.deleteProduct(id);

      if (result === "success") {
        return res.status(200).json({ Status: "OK", Result: "Successfully Deleted" });
      } else {
        return res.status(400).json({ Status: "Fail", Result: "Something Went Wrong" });
      }
    } catch (err) {
      console.error("❌ deleteRequest error:", err);
      return res.status(500).json({ Status: "Fail", Result: err.message });
    }
  };

  // ✅ Update Product (General Update)
  updateRequest = async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;

      if (!id) {
        return res.status(400).json({ Status: "Fail", Result: "Id is required" });
      }

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ Status: "Fail", Result: "Update data is required" });
      }

      const responseResult = await manageProduct.updateProduct(id, data);

      if (responseResult === "success") {
        return res.status(200).json({ Status: "OK", Result: "Successfully Updated" });
      }

      return res.status(400).json({ Status: "Fail", Result: responseResult });
    } catch (err) {
      console.error("❌ updateRequest error:", err);
      return res.status(500).json({ Status: "Fail", Result: err.message });
    }
  };

  // ✅ Update Availability (Stock Toggle)
  updateProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const db = await dbConfig();
      const collection = db.collection("Product_Master");

      const result = await collection.updateOne(
        { _id: parseInt(id) },
        { $set: data }
      );

      res.json({
        Status: result.acknowledged ? "OK" : "Fail",
        Result: result.acknowledged
          ? "Successfully Updated"
          : "Something Went Wrong",
      });
    } catch (err) {
      res.json({ Status: "Fail", Result: err.message });
    }
  };
}

module.exports = new ProductController();
