const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

//@desc GET all users
//@route GET /api/v1/user
//@access private (admin)
exports.getusers = asyncHandler( async(req,res,next)=>{
    const user = await User.find();
    res.status(200).json({success:true,count:user.length,data:user});
});

//@desc GET single user
//@route GET /api/v1/user/:id
//@access private (admin)
exports.getuser =  asyncHandler( async(req,res,next)=>{
 
    const user = await User.findById(req.params.id);
    if(!user){
      return next(new ErrorResponse(`Resourse with id ${req.params.id} not found`,400));
    }
    res.status(200).json({success:true,data:user});
});

//@desc Create single user
//@route POST /api/v1/user
//@access public (public)
exports.createuser = asyncHandler( async(req,res,next)=>{
    console.log(req.body);
    const user = await User.create(req.body);
    res.status(201).json(
      { 
        success:true,
        data:user
      });
});

//@desc Update user
//@route PUT /api/v1/user/:id
//@access private
exports.updateuser = asyncHandler( async(req,res,next)=>{
 
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });
    if(!user){
      return next(new ErrorResponse(`Resourse with id ${req.params.id} not found`,400));
    }
    res.status(200).json({
      success:true,
      data:user});

});

//@desc delete user
//@route DELETE /api/v1/user/:id
//@access private
exports.deleteuser = asyncHandler( async(req,res,next)=>{

    const user=await User.findById(req.params.id);
    if(!user){
      return next(new ErrorResponse(`Resourse with id ${req.params.id} not found`,400));
    }
    user.remove();
    res.status(200).json({success:true,data:{}}); 
});

