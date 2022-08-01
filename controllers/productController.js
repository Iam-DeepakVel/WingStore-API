const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customErr = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require('fs')


const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new customErr.NotFoundError(
      `Product with  id ${req.params.id} is not found`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    throw new customErr.NotFoundError(
      `Product with  id ${req.params.id} is not found`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new customErr.NotFoundError(
      `Product with  id ${req.params.id} is not found`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Product Deleted" });
};
const uploadImage = async (req, res) => {
  const {mimetype,size} = req.files.image
  
  if(!req.files){
    throw new customErr.BadRequestError(`Upload Image`)
  }
  
  if(!mimetype.startsWith('image')){
    throw new customErr.BadRequestError(`Upload only Image`)
  }
  
  let maxsize = 1024 * 1024 * 10
  if(size>maxsize){
    throw new customErr.BadRequestError(`File size should be less than 10MB`)
  }
    
  const imageUpload = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "WingStore",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath)
  return res.status(StatusCodes.OK).json({image:{src:imageUpload.secure_url}});
};


module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
