// ---------------------------------------------
// 🌙 ManageCategory.js (FINAL MongoDB VERSION)
// ---------------------------------------------
const { dbConfig } = require("./DBConfig");

class ManageCategory {
  // ✅ Get Max Category ID
  getMaxCategoryId = async () => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");

    const result = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const ID = (result.length > 0 ? result[0]._id : 0) + 1;
    return ID;
  };

  // ✅ Save Category
  saveCategory = async (data) => {
    try {
      const db = await dbConfig();
      const collection = db.collection("Category_Master");

      const categoryId = await this.getMaxCategoryId();

      const result = await collection.insertOne({
        _id: categoryId,
        category_name: data.category_name,
        description: data.description || "",
        type: data.type || "Veg",
        created_at: new Date(),
      });

      return result.acknowledged
        ? { Status: "OK", Result: "Successfully Saved" }
        : { Status: "Fail", Result: "Something Went Wrong" };
    } catch (error) {
      console.error("Save Error:", error);
      return { Status: "Fail", Result: error.message };
    }
  };

  // ✅ Get All Categories
  getCategories = async () => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");
    return await collection.find({}).toArray();
  };

  // ✅ Update Category
  updateCategory = async (id, data) => {
    try {
      const db = await dbConfig();
      const collection = db.collection("Category_Master");

      const result = await collection.updateOne(
        { _id: parseInt(id) },
        {
          $set: {
            category_name: data.category_name,
            description: data.description || "",
            type: data.type || "Veg",
          },
        }
      );

      if (result.modifiedCount > 0) {
        return { Status: "OK", Result: "Category updated successfully" };
      } else {
        return { Status: "Fail", Result: "No record updated" };
      }
    } catch (error) {
      console.error("Update Error:", error);
      return { Status: "Fail", Result: error.message };
    }
  };

  // ✅ Delete Category
  deleteCategory = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Category_Master");

    const result = await collection.deleteOne({ _id: parseInt(id) });

    return result.deletedCount > 0
      ? "Successfully Deleted"
      : "No Record Found";
  };
}

module.exports = new ManageCategory();
