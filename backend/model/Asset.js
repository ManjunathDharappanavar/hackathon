const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: String,

  value: {
    type: Number,
    required: true,
    default: 0
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);
