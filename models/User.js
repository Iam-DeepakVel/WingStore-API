const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
    maxlength: 30,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      msg: "Please Enter Valid Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter the password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

//Before Saving the password in Database we are Hashing the Password
UserSchema.pre('save', async function(){
  if(!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.comparePassword = async function(candidatePassword){
  const isValid = await bcrypt.compare(candidatePassword,this.password)
  return isValid
}

module.exports = mongoose.model('User',UserSchema)