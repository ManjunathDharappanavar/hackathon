const Asset = require("../model/Asset");
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");

/* CREATE */
// const createAsset = catchAsync(async (req, res, next) => {
//   const { name, category, value } = req.body;

//   const asset = await Asset.create({
//     name,
//     category,
//     value: Number(value), // 👈 force number
//     createdBy: req.params.userId
//   });

//   res.status(201).json(asset);

    
// });

const createAsset = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    if (!userId) {
      return next(new AppError("User ID is required in the URL parameters", 400));
    }
  const { name, category, value } = req.body;

  const asset = await Asset.create({
    name,
    category,
    value: Number(value), // 👈 force number
    createdBy: userId
  });

  res.status(201).json(asset);
});

/* READ ALL */
const getAssets = catchAsync(async (req, res, next) => {
  const assets = await Asset.find({ createdBy: req.params.userId });
  res.json(assets);
});

/* READ ONE */
const getAssetById = catchAsync(async (req, res, next) => {
  const asset = await Asset.findOne({
    _id: req.params.id,
    createdBy: req.params.userId,
  });
  if (!asset) {
    return next(new AppError("Asset not found", 404));
  }
  res.json(asset);
});

/* UPDATE */
const updateAsset = async(req, res)=>{
    try{
        // getting id to update product
        const id = req.params.id;
        if(!id){
            return res.status(400).json({error: 'id is required'})
        }

        const asset = await Asset.findByIdAndUpdate(id, req.body);
        if(!asset){
            return res.status(400).json({error: 'asset does not exist'})
        }
        return res.status(200).json({message: 'asset updated successfully', asset:asset})

    }catch(error){
        return res.status(500).json({error: 'internal server error'})
    }
}


/* DELETE */
const deleteAsset = catchAsync(async (req, res, next) => {
  const asset = await Asset.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.params.userId,
  });

  if (!asset) {
    return next(new AppError("Asset not found", 404));
  }

  res.json({ message: "Asset deleted successfully" });
});

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset
};