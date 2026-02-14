// ----------------------------------------
// 🌙 CategoryController.js
// ----------------------------------------
const manageCategory = require("./../DBOperation/ManageCategory");

class CategoryController {
  // ✅ Save new category
  saveRequest = async (req, res) => {
    const { category_name, type } = req.body;

    if (!category_name) {
      return res.status(400).json({ Status: "Fail", Result: "category_name is required" });
    }

    if (!type || !["Veg", "Non-Veg"].includes(type)) {
      return res.status(400).json({ Status: "Fail", Result: "type must be 'Veg' or 'Non-Veg'" });
    }

    const result = await manageCategory.saveCategory(req.body);

    if (result.Status === "OK") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  };

  // ✅ Get all categories
  listRequest = async (req, res) => {
    const data = await manageCategory.getCategories();
    return res.status(200).json({
      Result: data,
      Status: "OK",
    });
  };

  // ✅ Get categories by type (Veg / Non-Veg)
  listByTypeRequest = async (req, res) => {
    try {
      const { type } = req.params;

      if (!type || !["Veg", "Non-Veg"].includes(type)) {
        return res.status(400).json({
          Status: "Fail",
          Result: "Invalid or missing category type",
        });
      }

      const data = await manageCategory.getCategoriesByType(type);

      return res.status(200).json({
        Result: data,
        Status: "OK",
      });
    } catch (error) {
      console.error("Error fetching categories by type:", error);
      return res.status(500).json({
        Status: "Fail",
        Result: "Server Error",
      });
    }
  };

  // ✅ Get category by ID
  getByIdRequest = async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ Status: "Fail", Result: "Id Is Required" });
    }

    const result = await manageCategory.getCategoryById(id);

    if (result) {
      return res.status(200).json({ Status: "OK", Result: result });
    } else {
      return res.status(404).json({ Status: "Fail", Result: "Record Not Found" });
    }
  };

  // ✅ Delete category
  deleteRequest = async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ Status: "Fail", Result: "Id Is Required" });
    }

    const result = await manageCategory.deleteCategory(id);

    if (result === "Successfully Deleted") {
      return res.status(200).json({ Status: "OK", Result: "Successfully Deleted" });
    } else {
      return res.status(400).json({ Status: "Fail", Result: "Something Went Wrong" });
    }
  };

  // ✅ Update category
  updateRequest = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ Status: "Fail", Result: "Id Is Required" });
    }

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ Status: "Fail", Result: "Update Data Is Required" });
    }

    if (data.type && !["Veg", "Non-Veg"].includes(data.type)) {
      return res.status(400).json({ Status: "Fail", Result: "Invalid category type" });
    }

    const responseResult = await manageCategory.updateCategory(id, data);

    if (responseResult.Status === "OK") {
      return res.status(200).json(responseResult);
    }

    return res.status(400).json(responseResult);
  };
}

module.exports = new CategoryController();
