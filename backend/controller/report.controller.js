
const Asset = require("../model/Asset");
const Transaction = require("../model/Transaction");
const { catchAsync } = require("../utils/catchAsync");

 const getSummary = catchAsync(async (req, res, next) => {
  const assets = await Asset.countDocuments({ createdBy: req.params.assetId });
  const transactions = await Transaction.countDocuments({
    createdBy: req.params.userId,
  });
  res.json({ assets, transactions });
});

module.exports = { getSummary };