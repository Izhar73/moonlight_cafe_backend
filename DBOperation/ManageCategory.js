// ---------------------------------------------
// 🌙 ManageCategory.js
// ---------------------------------------------
const { dbConfig } = require("./DBConfig");

class ManageCategory {
  // ✅ Get Max Category ID
  getMaxCategoryId = async () => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");
    const result = await collection.find({}, { projection: { _id: 1 } }).sort({ _id: -1 }).toArray();
    const ID = (result.length > 0 ? result[0]._id : 0) + 1;
    console.log("Generated Category ID:", ID);
    return ID;
  };

  // ✅ Save Category
  saveCategory = async (data) => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");
    const categoryId = await this.getMaxCategoryId();

    console.log("Saving Category ID:", categoryId);

    const result = await collection.insertOne({
      _id: categoryId,
      category_name: data.category_name,
      description: data.description || "",
      type: data.type || "Veg", // ✅ Added Veg/Non-Veg type
      created_at: new Date(),
    });

    return result.acknowledged
      ? { Status: "OK", Result: "Successfully Saved" }
      : { Status: "Fail", Result: "Something Went Wrong" };
  };

  // ✅ Get All Categories
  getCategories = async () => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");
    return await collection.find({}).toArray();
  };

  // ✅ Get Categories by Type (Veg / Non-Veg)
  getCategoriesByType = async (type) => {
    try {
      const db = await dbConfig();
      const collection = db.collection("Category_Master");
      const categories = await collection.find({ type }).toArray();
      return categories;
    } catch (err) {
      console.error("Error in getCategoriesByType:", err);
      return [];
    }
  };

  // ✅ Get Category by ID
  getCategoryById = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");
    const category = await collection.findOne({ _id: parseInt(id) });
    return category || "No Category Found";
  };

  // ✅ Update Category
  async updateCategory(id, data) {
  try {
    const db = await dbConfig();
    await db.collection("Category").doc(id).update(data);

    return { Status: "OK", Result: "Category updated successfully" };
  } catch (error) {
    console.error("Update Error:", error);
    return { Status: "Fail", Result: error.message };
  }
}


  // ✅ Delete Category
  deleteCategory = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");

    const result = await collection.deleteOne({ _id: parseInt(id) });

    return result.deletedCount > 0 ? "Successfully Deleted" : "No Record Found";
  };
}

// ✅ Export
module.exports = new ManageCategory();
