const express = require("express");
const router = express.Router();
const AdminController = require("../Controller/AdminController");

router.get("/users", AdminController.getAllUsers);

module.exports = router;
