const express = require('express');
const { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } = require("../controller/asset.controller");

const router = express.Router();

router.get("/",  getAssets);
router.get("/:id",  getAssetById);

router.post("/:id", createAsset);
router.put("/:id",  updateAsset);
router.delete("/:id",  deleteAsset);

module.exports = router;
