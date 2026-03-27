const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
