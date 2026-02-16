const { dbConfig } = require("../DBOperation/DBConfig");
const jwt = require("jsonwebtoken");

class AuthController {
  login = async (req, res) => {
    const { email, password } = req.body;

    const db = await dbConfig();
    const user = await db
      .collection("Registeration_Master")
      .findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({
        Status: "Fail",
        Result: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      Status: "OK",
      Result: {
        token,
        user,
      },
    });
  };
}

module.exports = new AuthController();
