const customErr = require('../errors')
const {isTokenValid} = require('../utils/jwt')

const authenticateUser = async(req,res,next)=>{
 const token = req.signedCookies.token;
 if(!token){
  throw new customErr.UnauthenticatedError(`Authentication Invalid`)
 }
 try{
 const payload = isTokenValid({token})
 req.user = {name:payload.name,userId:payload.userId,role:payload.role};
 next()
  }catch(err){
    throw new customErr.UnauthenticatedError(`Authentication Invalid`)
  }
}

 const authorizePermissions = (...roles)=>{
   return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      throw new customErr.UnauthorizedError('You dont have permission to access this route')
    }
    next()
   }
 }

 module.exports = {authenticateUser,authorizePermissions}