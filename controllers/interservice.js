const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");
const User = require("../models/User");
const { getPointAmount } = require("../utils/request");
const { find } = require("lodash");

// const Group = require("../models/Group");
// const Buy = require("../models/Buy");
// const { refresh, refreshGC, refreshGT } = require("../utils/refresh");

// //In connection with approve service
exports.createUserLineMaker = asyncHandler(async (req, res, next) => {
  const { phone, password, username, group } = req.body;

  const existingUser = await User.findOne({ phone: phone });

  if (existingUser) {
    // check complete register
    return next(new ErrorResponse("user already exist", 403));
    // return next(new ErrorResponse("用户已经完成", 403));
  }
  // console.log(">>>>>>>>>>>>>>>>>>>>>>>", req.body);
  const create = await User.create({
    phone,
    password,
    username,
    group,
    isActive: true,
    complete: true,
  });

  res.status(200).json({
    success: true,
    data: create,
  });
});





exports.putPoints = asyncHandler(async(req , res , next)=>{
  console.log('bbbbbbbbbb',req.body)
  const {reason , userId , point } = req.body;
  const user = await User.findById(userId)
  console.log('points' , user.points + point)
  const newPoint = user.points + point
  await User.findByIdAndUpdate(userId , {
    $addToSet : {pointResons : reason},
    points : newPoint
  })
  return res.status(200).json({
    success : true
  })
})



exports.getDeviceToken = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  console.log(user);

  if (!user) {
    return next(new ErrorResponse("user not exist", 403));
  }
  const deviceTokenArray = user.deviceToken;
  if (!deviceTokenArray) {
    return next(new ErrorResponse("device token not found", 403));
  }
  console.log(deviceTokenArray);

  res.status(200).json({
    success: true,
    deviceTokenArray,
  });
});

exports.setVip = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, {
    isVip: true,
  });

  res.status(200).json({
    success: true,
  });
});

exports.unSetVip = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, {
    isVip: false,
  });

  res.status(200).json({
    success: true,
  });
});
exports.deleteGroupe = asyncHandler(async (req, res, next) => {
  const { group, userId } = req.body;
  await User.findByIdAndUpdate(userId, {
    $pull: { group: group },
  });
  res.status(201).json({
    success: true,
  });
});
exports.balanceAmount = asyncHandler(async (req, res, next) => {
  const userId=req.params.id
  const newAmount=req.params.price

  await User.findByIdAndUpdate(userId, {
    walletAmount:newAmount
  });
  res.status(201).json({
    success: true,
  });
});
exports.getUserA = asyncHandler(async (req, res, next) => {
  const user=await User.findById(req.params.id)
  console.log("userrrrrrrr",user)
  res.status(200).json({
    success: true,
    data:user
  });
});
// //In connection with approve service
// exports.createBuy = asyncHandler(async (req, res, next) => {
//   const find = await BussinessMan.findOne({
//     "user._id": req.body.buyer._id,
//   });

//   console.log("find>>>>>>>>><<<<", find);
//   console.log("req.body>>>>>>>>><<<<req.body", req.body);

//   const create = await Buy.create(req.body);

//   const update = await Buy.findByIdAndUpdate(create._id, {
//     "buyer.idCompany": find._id,
//     "buyer.profileCompany": find.profileCompany,
//     "buyer.companyName": find.companyName,
//   });

//   res.status(200).json({
//     success: true,
//     data: {},
//   });
// });
exports.addPoint = asyncHandler(async (req, res, next) => {
  const { type, userId, contentId, commentId } = req.body;
  let newResons
  const user = await User.findById(userId);
  const prevPoint = user.points;
  const pointsAmount = await getPointAmount();

  let amount = 0;
  if (!user) {
    return next(new ErrorResponse("User Not Found", 404));
  }
  if (!pointsAmount.success) {
    return next(new ErrorResponse("Server Error", 500));
  }
  console.log(type);
  switch (type) {
    case "createForum":
      amount = pointsAmount.points[0].createForum;
      newResons={
        resons: type,
        point:amount,
        content:contentId
      }
      break;
    case "deleteForum":
      // amount = -pointsAmount.points[0].createForum;
      newResons={
        resons: type,
        point:amount,
        content:contentId,
      }
      user.pointResons.forEach(point => {
        if(point.content==contentId){
          amount=amount+point.point
        }
      });
      break;
    case "like":
      amount = pointsAmount.points[0].like;
      newResons={
        resons: type,
        point:amount,
        content:contentId,
        comment:commentId,
      }
      break;
    case "unlike":
      amount = -pointsAmount.points[0].like;
      newResons={
        resons: type,
        point:amount,
        content:contentId,
        comment:commentId,
      }
      break;
    case "comment":
      amount = pointsAmount.points[0].comment;
      newResons={
        resons: type,
        point:amount,
        content:contentId,
        comment:commentId,
      }
      break;
    case "deleteComment":
      amount = -pointsAmount.points[0].comment;
      newResons={
        resons: type,
        point:amount,
        content:contentId,
        comment:commentId,
      }
      break;
    case "reportContent":
      amount =2*(-pointsAmount.points[0].createForum);
      newResons={
        resons: type,
        point:amount,
        content:contentId,
      }
      break;
    case "reportComment":
      amount = 2*(-pointsAmount.points[0].comment);
      newResons={
        resons: type,
        point:amount,
        content:contentId,
        comment:commentId,
      }
      break;
    default:
      return next(new ErrorResponse("Bad Request", 400));
  }
  await User.findByIdAndUpdate(userId, {
    $addToSet: { pointResons: newResons },
    points: prevPoint + amount,
  });

  res.status(201).json({
    success: true,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
   const number=req.params.number 
   let users=[]
   const allUser=await User.find()   
  
   if(number==0){
    allUser.forEach((user)=>{
      user.group.forEach(item=>{
         if(item=="baseUser"){
          const userObj={
            _id:user._id,
            pictureProfile:user.pictureProfile,
            username:user.username
          }
          users.push(userObj)
         }
      })
 })
   }
   if(number==1){
     allUser.forEach((user)=>{
          user.group.forEach(item=>{
             if(item=="commerce"){
              const userObj={
                _id:user._id,
                pictureProfile:user.pictureProfile,
                username:user.username
              }
              users.push(userObj)
             }
          })
     })
   }
   if(number==2){
    allUser.forEach((user)=>{
      user.group.forEach(item=>{
         if(item=="transport"){
           const userObj={
            _id:user._id,
            pictureProfile:user.pictureProfile,
            username:user.username
          }
          users.push(userObj)
         }
      })
 })
   }
   if(number==3){
    allUser.forEach((user)=>{
      user.group.forEach(item=>{
         if(item=="truck"){
          const userObj={
            _id:user._id,
            pictureProfile:user.pictureProfile,
            username:user.username
          }
          users.push(userObj)
         }
      })
 })
  }
  if(number==4){
    allUser.forEach((user)=>{
      user.group.forEach(item=>{
         if(item=="lineMaker"){
          const userObj={
            _id:user._id,
            pictureProfile:user.pictureProfile,
            username:user.username
          }
          users.push(userObj)
         }
      })
 })

  }
  res.status(200).json({success:true,users})
});

