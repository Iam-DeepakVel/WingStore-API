require('dotenv').config()
require('express-async-errors')
//express 
const express = require('express')
const app = express()
//db connect
const connectDB = require('./db/connect')

//Extra Packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

//Security Packages
const rateLimiter=require('express-rate-limit')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const cors = require('cors')

//Image Upload
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

//Importing Middlewares
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

//Routes Importing
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')
//To access data from req.body
app.use(express.json())
app.use(morgan('tiny'))


//Security Packages
app.set('trust proxy',1)
app.use(
  rateLimiter({
    windowsMs: 15* 60 * 1000,
    max:60
  })
)
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
//cross Origin resource sharing
app.use(cors())

app.use(express.static('./public'))

//Image Upload
app.use(fileUpload({useTempFiles:true}))
cloudinary.config({
  cloud_name:"cloudwings",
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})



//If while attaching token to cookie and if signed is true then you have to do below step by importing cookie-parser
app.use(cookieParser(process.env.JWT_SECRET))
//Routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)

//Basic route
app.get('/',(req,res)=>[
  res.send('WingStore')
])

//Using middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)



//Start Function
const port = process.env.PORT || 4000
const start = async()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port,()=> console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()