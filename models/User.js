const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Please add name'],
    maxlength:[50,'Name cant be more than 50']
  },
  mobile:{
    type:String,
    maxlength:12,
  },
  email:{
    type:String,
    require:[true,'Please add a email'],
    unique:true,
    match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'Please add a valid email',],
  },
  password:{
    type:String,
    require:[true,'Please add a password'],
    minlength:6,
    select:false,
  },
  address:{
    type:String,
  },
  state:{
    type:String,
  },
  country:{
    type:String,
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  }

});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); //return true or false
};

//Cascade delete mchildren when a user is deleted
UserSchema.pre('remove', async function (next) {
  console.log(`Mchildren being removed from User ${this._id}`);
  await this.model('Mchild').deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model('User',UserSchema);