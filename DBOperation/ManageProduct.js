const { dbConfig } = require("./DBConfig");

class ManageProduct {
  // ✅ Generate Next Product ID
  getMaxProductId = async () => {
    const db = await dbConfig();
    const collection = db.collection("Product_Master");
    const result = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const ID = (result.length > 0 ? result[0]._id : 0) + 1;
    console.log("Generated Product ID:", ID);
    return ID;
  };

  // ✅ Save Product
  saveProduct = async (data, fileName) => {
    try {
      const db = await dbConfig();
      const collection = db.collection("Product_Master");

      // 🧾 Generate unique numeric _id
      const lastRecord = await collection.find().sort({ _id: -1 }).limit(1).toArray();
      const productId = lastRecord.length > 0 ? lastRecord[0]._id + 1 : 1;

      // ✅ Insert new product
      const result = await collection.insertOne({
        _id: productId,
        ProductName: data.ProductName,
        Description: data.Description,
        Price: data.Price,
        FileName: fileName,
        CategoryId: data.CategoryId ? parseInt(data.CategoryId) : null,
        Available: data.Available ?? true, // ✅ Default true (means product is available)
        created_at: new Date()
      });

      if (result.acknowledged) {
        return "success";
      } else {
        return "fail";
      }
    } catch (err) {
      return err.message;
    }
  };

// ✅ Get All Products with Category Name
getProducts = async () => {
  const db = await dbConfig();
  const productCollection = db.collection("Product_Master");
  const categoryCollection = db.collection("Category_Master");

  const products = await productCollection
    .aggregate([
      {
        $lookup: {
          from: "Category_Master",
          localField: "CategoryId",
          foreignField: "_id",
          as: "CategoryData"
        }
      },
      {
        $unwind: {
          path: "$CategoryData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          ProductName: 1,
          Description: 1,
          Price: 1,
          FileName: 1,
          CategoryId: 1,
          CategoryName: "$CategoryData.category_name",
          created_at: 1,
          updated_at: 1,
          Available: { $ifNull: ["$Available", true] } // ✅ ensure Available always exists
        }
      }
    ])
    .toArray();

  return products;
};


  // ✅ Get Product By ID
  getProductById = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Product_Master");
    const product = await collection.findOne({ _id: parseInt(id) });
    return product || "No Product Found";
  };

  // ✅ Update Product
  updateProduct = async (id, data) => {
    const db = await dbConfig();
    const collection = db.collection("Product_Master");

    const result = await collection.updateOne(
      { _id: parseInt(id) },
      {
        $set: {
          ProductName: data.ProductName,
          Description: data.Description,
          Price: data.Price,
          FileName: data.FileName,
          CategoryId: data.CategoryId ? parseInt(data.CategoryId) : null,
          updated_at: new Date()
        }
      }
    );

    return result.modifiedCount > 0 ? "success" : "something went wrong";
  };

  // ✅ Delete Product
  deleteProduct = async (id) => {
    const db = await dbConfig();
    const collection = db.collection("Product_Master");

    const result = await collection.deleteOne({ _id: parseInt(id) });

    return result.deletedCount > 0 ? "success" : "no record found";
  };
}

module.exports = new ManageProduct();
