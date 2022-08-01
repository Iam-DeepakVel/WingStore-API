const User = require("../models/User");
const customErr = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const { attachCookiesToResponse } = require("../utils/jwt");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users, count: users.length });
};


const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new customErr.NotFoundError(
      `User with id ${req.params.id} not found`
    );
  }
  checkPermissions(req.user, req.params.id);
  res.status(StatusCodes.OK).json({ user });
};


const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  res.status(StatusCodes.OK).json({ user });
};


const updateUser = async (req, res) => {
  const{name,email} = req.body
  if(!name || !email){
    throw new customErr.BadRequestError(`Please provide name and email`)
  }
  const user = await User.findOneAndUpdate({_id:req.user.userId},{name,email},{
    new:true,
    runValidators:true
  })
 
  //Now update this to token also..So that frontEnd Knows that the name is changed
  const payload = {name:user.name,userId:user._id,role:user.role}
  attachCookiesToResponse({res,user:payload})
  
  res.status(StatusCodes.OK).json({updatedUser:payload})
};
const updateUserPassword = async (req, res) => {
  const {currentpassword,newpassword} = req.body
  if(!currentpassword || !newpassword){
    throw new customErr.BadRequestError(`Please enter current and new Password`)
  }
  const user = await User.findOne({_id:req.user.userId})

  const isCurrentPassValid = await user.comparePassword(currentpassword)
  if(!isCurrentPassValid){
    throw new customErr.UnauthenticatedError(`Invalid Current Pasword`)
  }
  user.password = newpassword;
  await user.save()
  res.status(StatusCodes.OK).json({msg:'Password Updated'})
};


module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
