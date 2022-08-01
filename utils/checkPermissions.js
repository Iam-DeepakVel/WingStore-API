const customErr = require("../errors");

const checkPermissions = (requestUser,resourceUserId)=>{
  if(requestUser.role === 'admin') return;  
  if(resourceUserId.toString() === requestUser.userId) return;
  throw new customErr.UnauthorizedError(`You dont have permission to access this route`)
}

module.exports = checkPermissions