const express = require("express");
const router = express.Router();
const DashboardController = require("../Controller/DashboardController");

router.get("/stats", DashboardController.statsRequest);

module.exports = router;
