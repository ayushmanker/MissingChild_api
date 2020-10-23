const mongoose = require('mongoose');

const MchildSchema = new mongoose.Schema({
  name:{
    type:String,
    maxlength:[50,'name cant be more than 50 letter'],
  },
  age:{
    type:Number,
    required:[true,'Please add the age of the child']
  },
  color:{
    type:String,
    required:[true,'Please add complexion of child']
  },
  height:{
    type:Number,
    required:[true,'Please add the height of child ']
  },
  weight:{
    type:Number
  },
  area:{
    type:String,
    required:[true,'Please add an area']
  },
  location:{
  area:String,  
  city:String,
  state:String,
  country:String,
  },
  photo:{
    type:String,
    default:'no-pic.jpg'
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  }

});

//before save add  fields of location
 MchildSchema.pre('save',async function(next){
    const arr = this.area.split(',');
    this.location = {
      area:arr[0],  
      city:arr[1],
      state:arr[2],
      country:arr[3]
    };

    this.area = undefined;
    next();
 });

module.exports = mongoose.model('Mchild',MchildSchema);