const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const customErr = require('../errors')
const {attachCookiesToResponse} = require('../utils/jwt')


const register = async(req,res)=>{
  const {email} = req.body
  
  const alreadyExists = await User.findOne({email})
  if(alreadyExists){
    throw new customErr.BadRequestError(`Email Already Exists`)
  }
  
  const role = await User.countDocuments({})=== 0 ? 'admin' : 'user'
  req.body.role = role;
  
  const user = await User.create(req.body)
  
  const payload = {name:user.name,userId:user._id,role:user.role}  
  attachCookiesToResponse({res,user:payload})
  
  res.status(StatusCodes.CREATED).json({user})
}

const login = async(req,res)=>{
  const {email,password} = req.body
  if(!email || !password){
    throw new customErr.BadRequestError(`Please provide Email and Password`)
  }
  const user = await User.findOne({email})
 
  if(!user){
    throw new customErr.NotFoundError(`Invalid Credentials`)
  }
  
  const pass = await user.comparePassword(password)
 
  if(!pass){
    throw new customErr.NotFoundError(`Invalid Credentials`)
  }
   
  const payload = {name:user.name,userId:user._id,role:user.role}  
  attachCookiesToResponse({res,user:payload})
  
  res.status(StatusCodes.OK).json({user:payload})
}

const logout = async(req,res)=>{
  res.cookie('token','logout',{
    httpOnly:true,
    expires:new Date(Date.now())
  })

  res.status(StatusCodes.OK).json({msg:'User logged out'})
}

module.exports = {
  register,
  login,
  logout
}
