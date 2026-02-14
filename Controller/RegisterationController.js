const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { dbConfig } = require("../DBOperation/DBConfig");

const JWT_SECRET = "moonlight_secret_key";

// ✅ Register new user
exports.register = async (req, res) => {
  try {
    const db = await dbConfig();
    const collection = db.collection("Registeration_Master");

    const { Name, Email, Mobile, Address, Password, UserName } = req.body;

    if (!Name || !Email || !Mobile || !Password || !UserName) {
      return res.status(400).json({
        Status: "Error",
        Message: "All fields are required",
      });
    }

    const existingUser = await collection.findOne({
      $or: [{ Email }, { UserName }],
    });

    if (existingUser) {
      return res.status(400).json({
        Status: "Error",
        Message: "Email or Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    // Generate simple incrementing ID
    const maxRecord = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const RegisterationId = (maxRecord.length > 0 ? maxRecord[0]._id : 0) + 1;

    const newUser = {
      _id: RegisterationId,
      FullName: Name,
      ContactNo: Mobile,
      Email,
      Address,
      UserName,
      Password: hashedPassword,
      created_at: new Date(),
    };

    await collection.insertOne(newUser);

    res.json({
      Status: "OK",
      Message: "User registered successfully",
      Result: {
        RegisterationId,
        Name,
        Email,
        Mobile,
        UserName,
      },
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ Status: "Error", Message: err.message });
  }
};

// ✅ Login existing user
exports.loginRequest = async (req, res) => {
  try {
    const db = await dbConfig();
    const collection = db.collection("Registeration_Master");

    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({
        Status: "Error",
        Message: "Email and Password are required",
      });
    }

    const user = await collection.findOne({ Email });

    if (!user) {
      return res.status(404).json({
        Status: "Failed",
        Message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({
        Status: "Failed",
        Message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, Email: user.Email, UserName: user.UserName },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      Status: "OK",
      Message: "Login successful",
      Token: token,
      Result: {
        Id: user._id,
        Name: user.FullName,
        Email: user.Email,
        Mobile: user.ContactNo,
        Address: user.Address,
        UserName: user.UserName,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      Status: "Failed",
      Message: "Something went wrong during login",
    });
  }
};

// ✅ Admin-only: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const db = await dbConfig();
    const collection = db.collection("Registeration_Master");

    // ✅ Remove password from results
    const users = await collection
      .find({}, { projection: { Password: 0 } })
      .toArray();

    res.json({
      Status: "OK",
      Result: users,
    });
  } catch (error) {
    console.error("❌ Get Users Error:", error);
    res.status(500).json({
      Status: "Error",
      Message: "Failed to fetch users",
    });
  }
};
