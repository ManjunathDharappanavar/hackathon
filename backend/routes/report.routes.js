const express = require('express');
const { getSummary } = require("../controller/report.controller");

const router = express.Router();
router.get("/summary/:userId",  getSummary);

module.exports = router;
