const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  rating:{
    type:Number,
    required:[true,'Please Provide the Rating'],
    min:1,
    max:5,
  },
  title:{
    type:String,
    required:[true,'please provide the title'],
    trim:true
  },
  comment:{
    type:String,
    required:[true,'Please provide the comment']
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true,
  },
  product:{
    type:mongoose.Schema.ObjectId,
    ref:'Product',
    required:true
  }
},{timestamps:true})


reviewSchema.index({user:1,product:1},{unique:true})



reviewSchema.statics.calculateAverageRating = async function(productId){
  const result = await this.aggregate([
    {
      $match:{
      product:productId,
    }
  },
  {
       $group:{
         _id:null,
         averageRating:{
          $avg:"$rating",
         },
         numOfReviews:{
          $sum:1,
         }
       }
  }
  ])
  try{
    const product = await this.model('Product').findOneAndUpdate({_id:productId},{
      //Optional Chaining
      averageRating:Math.ceil(result[0]?.averageRating || 0),
      numOfReviews:result[0]?.numOfReviews || 0
    })
  }catch(error){
     console.log(error)
  }
}

reviewSchema.post('save', async function(){
  await this.constructor.calculateAverageRating(this.product)
})

reviewSchema.post('delete', async function(){
  await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review',reviewSchema)