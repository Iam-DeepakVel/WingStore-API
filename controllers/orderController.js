const Order = require('../models/Order')
const Product = require('../models/Product')
const customErr = require('../errors')
const {StatusCodes} = require('http-status-codes')
const checkPermissions = require('../utils/checkPermissions')

const getAllOrders = async(req,res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({orders,count:orders.length})
}

const fakeStripeAPI = async(amount,currency)=>{
  const clientSecret = 'someRandomValue'
  return {amount,clientSecret}
}

const getSingleOrder = async(req,res) => {
  const order = await Order.findOne({_id:req.params.id})
  if(!order){
    throw new customErr.NotFoundError(`No order found with id ${req.params.id}`)
  }
  checkPermissions(req.user,order.user)
  res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrders = async(req,res)=>{
  
  const orders = await Order.find({user:req.user.userId})
  res.status(StatusCodes.OK).json({orders,count:orders.length})
}

const createOrder = async(req,res) => {
  const {tax,shippingFee,items:CartItems} = req.body
  if(!tax || !shippingFee){
    throw new customErr.BadRequestError(`Please enter tax and Shipping Fee`)
  }
  if(!CartItems || CartItems.length<1){
    throw new customErr.BadRequestError('Please select a product to Place Order')
  }
   
  let orderItems = []
  let subTotal = 0
  
  for(const item of CartItems){
  const dbproduct = await Product.findOne({_id:item.product})
  if(!dbproduct){
    throw new customErr.NotFoundError(`Product not Found`)
  }
  const {name,price,image,_id} = dbproduct
  const singleOrderItemSchema = {
    name,
    price,
    image,
    product:_id,
    amount:item.amount
  }
  orderItems = [...orderItems,singleOrderItemSchema] 
  subTotal =subTotal + item.amount*price
 }
 const total = subTotal + tax + shippingFee
 
 const paymentIntent = await fakeStripeAPI({
  amount:total,
  currency:'usd'
})

const order = await Order.create({
  tax,shippingFee,subTotal,total,orderItems,user:req.user.userId,clientSecret:paymentIntent.clientSecret
})
 res.status(StatusCodes.CREATED).json({order})
}


const updateOrder = async (req,res)=>{
  const {paymentIntentId} = req.body
  const order = await Order.findOne({_id:req.params.id})
  if(!order){
    throw new customErr.NotFoundError(`Order Not Found`)
  }
  checkPermissions(req.user,order.user)
  order.paymentIntentId= paymentIntentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({order})
}


module.exports = {
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  createOrder,
  updateOrder
}