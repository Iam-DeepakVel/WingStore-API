const Review = require("../models/Review");
const customErr = require("../errors");
const Product = require("../models/Product");
const {StatusCodes} = require("http-status-codes")
const checkPermissions = require('../utils/checkPermissions')
const createReview = async (req, res) => {
  const { product: productId } = req.body;
 //Checking whether the product Exists
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new customErr.NotFoundError(
      `Product with id ${productId} is not found`
    );
  }
  //Checking whether already review exists for this product
  const reviewAlreadyExists = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (reviewAlreadyExists) {
    throw new customErr.BadRequestError(`Review already Exists`);
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({review})
};
const getAllReview = async (req, res) => {
  const reviews = await Review.find({})
  res.status(StatusCodes.OK).json({reviews,count:reviews.length})
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({_id:req.params.id})
  if(!review){
    throw new customErr.NotFoundError(`Review with id${req.params.id} not found`)
  }
  res.status(StatusCodes.OK).json({review})
};

const updateReview = async (req, res) => {
  const {rating,title,comment} = req.body
  const review = await Review.findOne({
    _id:req.params.id
  })
  if(!review){
    throw new customErr.NotFoundError(`Review with id${req.params.id} not found`)
  }
  checkPermissions(req.user,review.user)
  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()
  res.status(StatusCodes.OK).json({review})
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({
    _id:req.params.id
  })
  if(!review){
    throw new customErr.NotFoundError(`Review with id${req.params.id} not found`)
  }
  checkPermissions(req.user,review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({msg:'Review Deleted'})
};


const getSingleProductReviews = async(req,res)=>{
  const reviews = await Review.find({
    product:req.params.id
  })
  res.status(StatusCodes.OK).json({reviews})
}

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
