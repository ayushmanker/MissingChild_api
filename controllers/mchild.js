const Mchild = require('../models/Mchild');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
// to find the extension of the file (photo)
const path = require('path');

//@desc Get all mchildren
//@route GET /api/v1/mchild 
//@access private (admin)
exports.getmchildren = asyncHandler(async(req,res,next)=>{

    const mchildren = await Mchild.find();
    res.status(200).json({
      success:true,
      count:mchildren.length,
      data:mchildren
    });
});

//@desc Get one mchild
//@route GET /api/v1/mchild/:id
//@access private 
exports.getmchild = asyncHandler(async(req,res,next) =>{
    const mchild = await Mchild.findById(req.params.id);

    if(!mchild){
     return next(new ErrorResponse(`Resource not find with id ${req.params.id}`,404));
    }

    // Make sure the user belongs to mchild
    if (mchild.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to access this mchild `,
        401
      )
     );
   }
    res.status(200).json({
      success:true,
      data:mchild
    });
});

//@desc Create new mchild
//@route POST /api/v1/mchild
//@access private
exports.createmchild = asyncHandler(async (req,res,next)=>{
    //Add user to req.body
    req.body.user = req.user.id;

    const mchild = await Mchild.create(req.body);
    res.status(201).json({
      success:true,
      data:mchild
    });
});

//@desc Update mchild
//@route PUT /api/v1/mchild/:id
//@access private
exports.updatemchild = asyncHandler(async(req,res,next)=>{
  
    let mchild = await Mchild.findById(req.params.id);
    if(!mchild){
      return next(new ErrorResponse(`Resource not find with id ${req.params.id}`,404));
    }

    // Make sure the user belongs to mchild
    if (mchild.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
       new ErrorResponse(
         `User ${req.params.id} is not authorized to update this mchild `,
         401
       )
      );
    }

    mchild = await Mchild.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })

    res.status(200).json({
      success:true,
      data:mchild});
});

//@desc delete mchild
//@route DELETE /api/v1/mchild/:id
//@access private
exports.deletemchild = asyncHandler(async (req,res,next)=>{
    const mchild=await Mchild.findById(req.params.id);
    if(!mchild){
      return next(new ErrorResponse(`Resource not find with id ${req.params.id}`,404));
    }

     // Make sure the user belongs to mchild
     if (mchild.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
       new ErrorResponse(
         `User ${req.params.id} is not authorized to update this mchild `,
         401
       )
      );
    }
    
    mchild.remove();
    res.status(200).json({success:true,data:{}}); 
});

//@desc   Upload photo of Mchild
//@route  PUT /api/v1/mchild/:id/photo
//@access Private
exports.mchildPhotoUpload = asyncHandler(async (req, res, next) => {
  const mchild = await Mchild.findById(req.params.id);
  if (!mchild) {
    return next(
      new ErrorResponse(`Missing child not found with id of ${req.params.id}`, 404)
    );
  }
 
  // Make sure the user belongs to mchild
  if (mchild.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this mchild `,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // console.log(req.files.file);
  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload a image file `, 400));
  }

  //Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
        400
      )
    );
  }

  //Create custom filename and add it to the custom directory
  file.name = `photo_${mchild._id}${path.parse(file.name).ext}`;

  //mv means move
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Mchild.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
