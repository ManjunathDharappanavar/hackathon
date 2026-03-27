const Transaction = require("../model/Transaction");
const Asset = require("../model/Asset");
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");

/**
 * CREATE TRANSACTION
 */
 const createTransaction = catchAsync(async (req, res, next) => {
  const { assetId, type, amount } = req.body;
const userId = req.params.userId;
  if (!userId) {
    return next(new AppError("User ID is required in the URL parameters", 400));
  }

  if (!assetId || !type || !amount) {
    return next(new AppError("All fields are required", 400));
  }

  const asset = await Asset.findById(assetId);
  if (!asset) {
    return next(new AppError("Asset not found", 404));
  }

  // Store original value for rollback
  const originalValue = asset.value;

  if (type === "expense") {
    asset.value -= Number(amount);
  } else {
    asset.value += Number(amount);
  }

  await asset.save();

  try {
    const transaction = await Transaction.create({
      assetId,
      type,
      amount: Number(amount),
      createdBy: userId
    });

    res.status(201).json(transaction);
  } catch (err) {
    // Rollback if transaction creation fails
    asset.value = originalValue;
    await asset.save();
    return next(err);
  }
});

/**
 * GET ALL TRANSACTIONS
 */
 const getTransactions = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const transactions = await Transaction.find({ createdBy: userId })
    .populate("assetId", "name")
    .sort({ createdAt: -1 });

  res.json(transactions);
});

/**
 * GET SINGLE TRANSACTION
 */

 const getTransactionById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: userId
  });

  if (!transaction) {
    return next(new AppError("Transaction not found", 404));
  }

  res.json(transaction);
});

/**
 * DELETE TRANSACTION (ROLLBACK ASSET VALUE)
 */
 const deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: req.params.userId,
  });
  if (!transaction) {
    return next(new AppError("Transaction not found", 404));
  }

  const asset = await Asset.findById(transaction.assetId);

  // Consider: what if asset was deleted?
  if (asset) {
    if (transaction.type === "expense") {
      asset.value += transaction.amount;
    } else {
      asset.value -= transaction.amount;
    }
    await asset.save();
  }

  await transaction.deleteOne();

  res.json({ message: "Transaction deleted successfully" });
});

module.exports = { createTransaction, getTransactions, getTransactionById, deleteTransaction };