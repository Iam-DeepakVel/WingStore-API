const mongoose = require('mongoose')

const singleOrderItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  price:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  amount:{
    type:String,
    required:true
  },
  product:{
    type:mongoose.Schema.ObjectId,
    ref:'Product',
    required:true
  }
})

const orderSchema = new mongoose.Schema({
  tax:{
    type:Number,
    required:true,
  },
  shippingFee:{
    type:Number,
    required:true,
  },
  subTotal:{
    type:Number,
    required:true,
  },
  total:{
    type:Number,
    required:true,
  },
  orderItems:[singleOrderItemSchema],
  status:{
    type:String,
    enum:['pending','failed','paid','delivered1','cancelled'],
    default:'pending'
  },
  clientSecret:{
    type:String,
    required:true
  },
  paymentIntentId:{
    type:String
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true})

module.exports = mongoose.model('Order',orderSchema)