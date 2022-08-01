const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true,'Please provide Product Name'],
    maxlength:[100,'Name cannot exceeds 100 Characters']
   },
   price:{
    type:Number,
    required:[true,'Please provide Product Price'],
    default:0
   },
   description:{
    type:String,
    required:[true,'Please provide Description'],
    maxlength:[1000,'Description cannot exceeds 1000 Characters']
   },
   image:{
    type:String,
    required:[true,'Please provide Product Name'],
    default:'/uploads/example.jpg'
   },
   category:{
    type:String,
    required:[true,'Please select a category'],
    enum:['kitchen','bedroom','office'],
   },
   company:{
    type:String,
    enum:{
      values:['ikea','liddy','marcos'],
      message:"{VALUE} is not Supported"
    },
   },
   colors:{
    type:[String],
    default:["#222"],
    required:[true,'Please enter the color']
   },
   featured:{
    type:Boolean,
    default:false
   },
   freeShipping:{
    type:Boolean,
    default:false,
   },
   inventory:{
    type:Number,
    required:true,
    default:15
   },
   averageRating:{
    type:Number,
    default:0
   },
   numOfReviews:{
    type:Number,
    default:0,
   },
   user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
   },
  },{timestamps:true})


productSchema.pre('remove', async function(){
  await this.model('Review').deletemany({product:this._id})
})

module.exports = mongoose.model('Product',productSchema)