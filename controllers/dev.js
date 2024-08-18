const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Group = require("../models/Group");
const sendSms = require("../utils/sendSms")
const adminGroup = require("../models/adminGroup");
// @desc      create Permission
// @route     POST /api/v1/admins/permission/all/:id
// @access    private
exports.allUser = asyncHandler(async (req, res, next) => {
  const findAll = await User.find();

  res.status(200).json({
    success: true,
    data: findAll,
  });
});

// @desc      create Permission
// @route     POST /api/v1/admins/permission/all/:id
// @access    private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { username, phone } = req.body;
  const findAll = await User.findByIdAndUpdate(req.params.id, {
    username,
    phone,
  });

  res.status(200).json({
    success: true,
    data: findAll,
  });
});

exports.allGroup = asyncHandler(async (req, res, next) => {
  const findAll = await Group.find();

  res.status(200).json({
    success: true,
    data: findAll,
  });
});

// @desc      create Permission
// @route     POST /api/v1/admins/permission/all/:id
// @access    private
exports.delAll = asyncHandler(async (req, res, next) => {
  const{phone,from,code,accountSid,authToken}=req.body
  const result=await sendSms(authToken,accountSid,phone,from,code)
  res.status(201).json({
   success:true,
   data:result
 })
});

exports.del = asyncHandler(async (req, res, next) => {
  await User.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      create Permission
// @route     POST /api/v1/admins/permission/all/:id
// @access    private
exports.addLocations = asyncHandler(async (req, res, next) => {
  const findUser = await User.findById(req.params.id);

  await User.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { favoriteLocations: req.body.locations },
    },
    { new: true, strict: true }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.deleteAllDeviceToken=asyncHandler(async (req, res, next) => {
 const allUser=await User.find()
 console.log(allUser);
  allUser.forEach(async(user)=>{
    if(user.deviceToken||user.deviceToken.length!==0){
      await User.findByIdAndUpdate(user._id,{
         deviceToken:[]
      })
    }
  })
  res.status(201).json({
    success:true
  })
})
exports.setAllPointTo0=asyncHandler(async (req, res, next) => {
  const allUser=await User.find()
  console.log(allUser);
   allUser.forEach(async(user)=>{
     if(user.points!=0){
       await User.findByIdAndUpdate(user._id,{
          points:0
       })
     }
   })
   res.status(201).json({
     success:true
   })
 })
 

// @desc      create Permission
// @route     POST /api/v1/admins/permission/all/:id
// @access    private
exports.create = asyncHandler(async (req, res, next) => {
  const {
    username,
    firstName,
    lastName,
    fullName,
    phone,
    role,
    email,
    password,
    pictureProfile,
    documents,
    code,
    points,
    favoriteLocations,
    group,
    pending,
    codeUsed,
    isActive,
    complete,
    seen,
    deviceToken,
    ipAddress,
    osPhone,
    brandPhone,
    modelPhone,
    devices,
    resetPasswordToken,
    resetPasswordExpire,
    lastLogin,
  } = req.body;

  const findAll = await User.create({
    username,
    firstName,
    lastName,
    fullName,
    phone,
    role,
    email,
    password,
    pictureProfile,
    documents,
    code,
    points,
    favoriteLocations,
    group,
    pending,
    codeUsed,
    isActive,
    complete,
    seen,
    deviceToken,
    ipAddress,
    osPhone,
    brandPhone,
    modelPhone,
    devices,
    resetPasswordToken,
    resetPasswordExpire,
    lastLogin,
  });

  res.status(200).json({
    success: true,
    data: findAll,
  });
});




exports.changeAllPass=asyncHandler(async (req, res, next) => {
   const allUser=await User.find()
   console.log("here");
   allUser.forEach(async(item)=>{
        const userId=item._id
        const userPhone=item.phone
        
        const userNewNum=userPhone.substring(11,9)

        console.log(userNewNum);


        await User.findByIdAndUpdate(userId,{
          password:`test@${userNewNum}`
        })
   })

   res.status(201).json({
     success:true,
   })
 })
 exports.smsCheckDev=asyncHandler(async (req, res, next) => {
  
  const {code,phone}=req.body
 const result=await sendSms(phone,code)
 res.status(201).json({
  success:true,
  data:result
})

})

exports.sms=asyncHandler(async (req, res, next) => {
  const result=await sendSms("0014164644734",1212)
  res.status(201).json({
   success:true,
   data:result
 })
 })
 
 
 
 
 exports.addNewGroup = asyncHandler(async(req , res , next)=>{
  console.log('body>>>>',req.body)
  if (!req.body.name || !req.body.accessArray){
    return res.status(400).json({
      success : false,
      data : null,
      error : `please complete all field and try again!!!`
    })
  }
  new adminGroup(req.body).save().then((resault)=>{
    res.status(200).json({
      success : true,
      data : resault,
      error : null
    })
  }).catch((err)=>{
    res.status(503).json({
      success : false,
      data : null,
      error : `${err}`
    })
  })
})

exports.getAllAdminGroup = asyncHandler(async(req , res , next)=>{
  adminGroup.find().then((resault)=>{
    res.status(200).json({
      success : true,
      data : resault,
      error : null
    })
  }).catch((err)=>{
    res.status(503).json({
      success : false,
      data : '',
      error : `${err}`
    })
  })
})

exports.updateAdminGroup = asyncHandler(async(req , res , next)=>{
  const id = req.params.groupid
  if (!req.body){
    res.status(400).json({
      success : false,
      data : null,
      error : `please complete all fields and try again!!!`
    })
  }
  adminGroup.findByIdAndUpdate(id , req.body).then((resault)=>{
    res.status(200).json({
      success : true,
      data : resault,
      error : null
    })
  }).catch((err)=>{
    res.status(503).json({
      success : false,
      data : '',
      error : `${err}`
    })
  })
})



exports.deleteAdminGroup = asyncHandler(async(req , res , next)=>{
    const id = req.params.groupid
    const group = await adminGroup.findById(id)
    if (!group){
      res.status(400).json({
        success : false,
        data : null,
        error : `the group not found!!`
      })
    }
    if (group.isActive){
        adminGroup.findByIdAndUpdate(id , {isActive : false}).then(async(resault)=>{
      const updated = await adminGroup.findById(id)    
      res.status(200).json({
        success : true,
        data : updated,
        error : null
      })
    }).catch((err)=>{
      console.log('databaseError>>>>' , err)
      res.status(503).json({
        success : false,
        data : '',
        error : `${err}`
      })
    })
    }else{
    adminGroup.findByIdAndUpdate(id , {isActive : true}).then(async(resault)=>{
      const updated = await adminGroup.findById(id)
      res.status(200).json({
        success : true,
        data : updated,
        error : null
      })
    }).catch((err)=>{
      console.log('databaseError>>>>' , err)
      res.status(503).json({
        success : false,
        data : '',
        error : `${err}`
      })
    })
    }
    
})
 
 
 
 
 