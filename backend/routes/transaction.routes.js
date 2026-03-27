const express = require('express');
const { createTransaction, getTransactions, getTransactionById, deleteTransaction } = require("../controller/transaction.controller");

const router = express.Router();

router.post("/:userId",  createTransaction);
router.get("/:userId",  getTransactions);
router.get("/:id/:userId",  getTransactionById);
router.delete("/:id/:userId",  deleteTransaction);

module.exports = router;
