const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const {pushNotificationStatic}=require("../utils/pushNotif")
const User = require("../models/User");
const Group = require("../models/Group");
const sendSms = require("../utils/sendSms")
const sendSmsTest=require("../utils/testServerSms")
const { getdata } = require("../cache");
const phoneUtil = require('google-libphonenumber');
const adminGroup = require("../models/adminGroup");
const lastUsers = require("../models/lastUsers")
const pp = phoneUtil.PhoneNumberUtil.getInstance()


// Authenticate


const {
  request,
  getInfoForChartCommerce,
  getInfoForChartTransport,
  getInfoForChartTruck,
  getPointAmount,
  smsCheck,
  newLog,
  createWallet
} = require("../utils/request");
const moment = require("moment");
const fetch = require("node-fetch");
const { access } = require("fs");



// @desc      Register user
// @route     POST /api/v1/auth/user/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  
    let newNum = ''
    
    // console.log(num.split(''))
    
    for (let i = 2 ; i < req.body.phone.split('').length ; i++){
        newNum += req.body.phone.split('')[i]
    }
    
    console.log('phone instance>>>',newNum)
    
  
  

  console.log( 'phone number>>>' , pp.isValidNumber(pp.parseAndKeepRawInput( newNum , 'ca')))
    
  console.log('is phone for canada?? >>>>',pp.isValidNumberForRegion(pp.parse( newNum , 'ca'), 'ca'))
 
  
//   if (pp.isValidNumber(pp.parseAndKeepRawInput( newNum , 'ca')) && pp.isValidNumberForRegion(pp.parse( newNum , 'ca'), 'ca')){
//       const sendsms=true
//   }else{
//       const sendsms=false
//   }
 let sendsms=false
 if (pp.isValidNumberForRegion(pp.parse( newNum , 'ca'), 'ca')){
  sendsms=true
 }
  console.log(code)
  const { phone, email } = req.body;
  
  if (!phone) {
    return next(new ErrorResponse("Please add a phone", 403));
  }
  let inputString = phone;
  let outputString = "+" + inputString.slice(2);
  const existingUser = await User.findOne({ phone: phone });
  if (existingUser&&existingUser.complete==true) {
    return next(new ErrorResponse("This phone number has already been registered", 403));
  }
  if(existingUser&&existingUser.complete==false){
    if(sendsms){await sendSms(outputString,code)}
   const user = await User.findOneAndUpdate({ phone: phone },
     { code,
      codeUsed:false
    }
    );
    return res.status(200).json({
      success: true,
      data: { code: user.code, phone: user.phone},
    });
  }
  if(sendsms){await sendSms(outputString,code)}
  
  const user = await User.create({
    phone,
    email,
    code,
    complete:false
    
  });
  res.status(200).json({
    success: true,
    data: { code: user.code, phone: user.phone},
  });
});



// @desc      Register user
// @route     POST /api/v1/auth/user/register
// @access    Public
exports.completeRegister = asyncHandler(async (req, res, next) => {
  // console.log("start<<<<<<,");
  const code = Math.floor(Math.random() * 90000) + 10000;
  const {
    username,
    firstName,
    lastName,
    fullName,
    phone,
    email,
    interducer,
    password,
    pictureProfile,
    documents,
    group,
    deviceToken
  } = req.body;
  // console.log("req.body>>>>>>>>>>>>>>>", req.body);

  if (!password) {
    // console.log("eror111111111111111");

    return next(new ErrorResponse("Please add password", 401));
  }

  if (!username) {
    // console.log("eror22222222222");

    return next(new ErrorResponse("Please add username", 401));
  }
  let userNew;
  const findUsername = await User.findOne({ username });
  if (findUsername) {
    userNew = username + code;
  }

  const findGroup = await Group.findOne({ number: 100 });

  // if (!findGroup) {
  //   return next(new ErrorResponse("Failed. Try again", 401));
  // }

  if (phone) {
    const findUser = await User.findOne({ phone });

    if (findUser.complete) {
      // console.log("eror333333333333");

      return next(new ErrorResponse("You already complete register", 401));
    }

    if (!findUser) {
      // console.log("eror4444444444");

      return next(new ErrorResponse("complete register failed", 401));
    }
    const wallet=await createWallet(findUser._id,username,pictureProfile)
    console.log(wallet);
    if(!wallet){
      return next(new ErrorResponse(500,"Some thing went wrong please try again"))
    }
    const user = await User.findOneAndUpdate(
      { _id: findUser._id },
      {
        username: userNew ? userNew : username,
        firstName,
        lastName,
        fullName,
        phone,
        email,
        password,
        pictureProfile,
        documents,
        deviceToken,
        isActive: true,
        complete: true,

        group:"baseUser",
      },
      { new: true }
    );

    const recipient = {
      _id: findUser._id,
      phone: findUser.phone,
      pictureProfile: pictureProfile,
      username: userNew ? userNew : username,
    };
    if(interducer){
      const points = await getPointAmount();
      const pointAmount = points.points[0].inviteUser;
      const user = await User.findById(interducer);
      const userPoints = user.points + pointAmount;
      const userInviteNumber=user.totalInvitedUser+1
      const result = await User.findByIdAndUpdate(interducer,{
        points: userPoints,
        totalInvitedUser:userInviteNumber,
      });
      const resultt = await User.findByIdAndUpdate(findUser._id,{
        interducer
      });
    }
    

    sendTokenResponse(user, 200, res);
  }
});

exports.pushWelcome = asyncHandler(async (req, res, next) => {
  await pushNotificationStatic(req.user._id,1)
  res.status(200)
})


exports.addAdmin = asyncHandler(async (req, res, next) => {
  console.log('>>>>>>>>>>>>',req.user)
  const { phone, username , password , adminRole , firstName , lastName } = req.body;
  // const isSuperAdmin = req.user.group.includes("superAdmin");

  if (!phone || !username || !password  || !adminRole) {
    return next(new ErrorResponse("The information is incomplete", 403));
  }

  const existUser = await User.findOne({
    $or: [{ phone: phone }, { username: username }],
  });

  if (existUser) {
    return next(
      new ErrorResponse("This username or phone already exist !!", 403)
    );
  }

  const accessArray = await adminGroup.findById(adminRole)
  
  const user = await User.create({
    phone,
    username,
    password,
    firstName,
    lastName,
    group : ['admin'],
    accessArray : accessArray.accessArray,
    adminRole : [{name : accessArray.name , id : adminRole}],
    isActive:true,
  });

  const updateGroup = await adminGroup.findByIdAndUpdate(adminRole , {$addToSet : {members : {id : user._id , username : username}}})
    
   try{
      const log = {
      admin : {username : req.user.username , phone : req.user.phone , adminRole : "superAdmin",group : req.user?.group  , firstName : req.user?.firstName , lastName : req.user?.lastName},
      section : "Admin",
      part : "Add Admin",
      success : true,
      description : `${username} successfully Add as a admin by ${req.user.username}`,
    }
    await newLog(log)
   }catch(err){
       console.log(err)
   }
    
  sendTokenResponse(user, 200, res);
});




exports.allAdmin = asyncHandler(async (req, res, next) => {
  const all = await User.find();

  let admin = [];
  all.map(async (item) => {
    item.group.map(async (elem) => {
      if (item.group == "admin" || item.group == "superAdmin") {
        await admin.push(item);
      }
    });
  });
    

  res.status(200).json({
    success: true,
    data: admin,
  });
});

exports.token = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }

  await user.updateOne(
    {
      deviceToken: req.params.deviceToken,
      ipAddress: req.params.ipAddress,
      osPhone: req.params.osPhone,
      modelPhone: req.params.modelPhone,
      brandPhone: req.params.brandPhone,
    },
    { new: true, strict: false }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      check code
// @route     POST /api/v1/users/auth/register
// @access    Public
exports.checkCode = asyncHandler(async (req, res, next) => {
  const users = await User.findOne({ phone: req.params.phone });

  if (!users) {
    return next(new ErrorResponse("This user does not exist", 401));
  }

  // if (req.params.code == users.code && users.codeUsed) {
  //   return next(new ErrorResponse("This code has been used before", 401));
  //   // return next(new ErrorResponse("这个代码以前用过", 401));
  // }

  // console.log(req.params.code);
  // console.log(users.code);

  if (req.params.code == users.code) {
    await users.updateOne(
      { codeUsed: true },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    return next(new ErrorResponse("Invalid credentials", 401));
    // return next(new ErrorResponse("无效证件", 401));
  }
});


// @desc      again code
// @route     POST /api/v1/users/auth/register
// @access    Public
exports.againCode = asyncHandler(async (req, res, next) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  
  const user = await User.findOne({ phone: req.params.phone });

  if (!user) {
    return next(new ErrorResponse("This user does not exist", 401));
  }


  await user.updateOne(
    { codeUsed: false, code: code },
    {
      new: true,
      runValidators: true,
    }
  );
  let inputString = req.params.phone;
  let outputString = "+" + inputString.slice(2);
  console.log(outputString); // Output: "+164724221"
  await sendSms(outputString,code)
  res.status(200).json({
    success: true,
  });
});


// @desc      Login user with phone
// @route     POST /api/v1/admins/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  let user;
 console.log( req.headers['x-forwarded-for'])
  if (req.body.phone) {
    const { phone, password } = req.body;

    if (!password || !phone) {
      return next(
        new ErrorResponse("Please provide an password and Phone", 400)
      );
    }

    // Check for user
    user = await User.findOne({ phone }).select("+password");
  }
  
  if (!user.isActive){
    return next(new ErrorResponse("This user cant log in to the application.."))
  }
  
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(req.body.password);

  // true false

  if (!isMatch) {
    return next(new ErrorResponse("The password is incorrect", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Login user with phone
// @route     POST /api/v1/admins/auth/login
// @access    Public
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  console.log( req.headers['x-forwarded-for'])
//   if (req.headers['x-forwarded-for'] == '104.234.120.16'){
//       console.log('ali cant>>>')
//       return res.status(401).json({
//           message : 'you cant login!!!!'
//       })
//   }
  const { password, username } = req.body;

  if (!password || !username) {
    return next(new ErrorResponse("Please provide an password and username", 400));
  }

  const user = await User.findOne({ username : username },
  ).select("+password");
  console.log('user>>' , user)

    // console.log(user)

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  if (!user.isActive){
      return next(new ErrorResponse("forbidden admin!!!", 401))
  }
  
  if (
    (user.group[0] == "admin" || user.group[0] == "superAdmin") 
  ) {
    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("The password is incorrect", 401));
    }
    const log = {
      admin : {username :username , phone : user.phone , adminRole : user?.adminRole[0]?.name, firstName : user?.firstName , lastName : user?.lastName , group : user?.group },
      section : "authontication",
      part : "login",
      success : true,
      description : `${username} successfully loged in to the pannel`,
    }
    await newLog(log)
    sendTokenResponse(user, 200, res);
  } else {
    return next(new ErrorResponse("You are not an admin", 401));
  }
  
});

// @desc      Get current logged in user
// @route     POST /api/v1/users/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return next(new ErrorResponse("user not found", 401));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/users/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  // find user
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
    // return next(new ErrorResponse("密码不正确", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});



// @desc    Forgot password
// @route   POST /api/v1/users/auth/forgotpassword
// @access  Private
exports.forgotPasswordCode = asyncHandler(async (req, res, next) => {
  // let sms=false
  const user = await User.findOne({ phone: req.params.phone });

  if (!user) {
    return next(
      new ErrorResponse("There is no user with that email or phone", 404)
    );
  }
  const code = Math.floor(1000 + Math.random() * 9000);
  

  const now = Date.now();

  await User.findByIdAndUpdate(user._id, {
    codePass: code,
    codeUsedPass: false,
    codePassTime: now,
  });
   let inputString = req.params.phone;
   let outputString = "+" + inputString.slice(2);
   console.log(outputString); 
   await sendSms(outputString,code)

  return res.status(200).json({
    success: true,
  });
});

// @desc      check code
// @route     POST /api/v1/users/auth/register
// @access    Public
exports.checkCodePass = asyncHandler(async (req, res, next) => {
  const users = await User.findOne({ phone: req.params.phone });

  if (!users) {
    return next(new ErrorResponse("This user does not exist", 401));
  }

  console.log("users");

  if (req.params.code == users.codePass && users.codeUsedPass) {
    return next(new ErrorResponse("This code has been used before", 401));
    // return next(new ErrorResponse("这个代码以前用过", 401));
  }

  console.log("users2");

  if (req.params.code == users.codePass) {
    await users.updateOne(
      { codeUsedPass: true },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("users3");
    res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    return next(new ErrorResponse("Invalid credentials", 401));
    // return next(new ErrorResponse("无效证件", 401));
  }
});



exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const userFind = await User.findOne({ phone: req.params.phone });

  if (!userFind) {
    return next(
      new ErrorResponse("There is no user with that email or phone", 404)
    );
  }
  // if (req.params.code == user.codePass && user.codeUsedPass) {
  //   // return next(new ErrorResponse("This code has been used before", 401));
  //   return next(new ErrorResponse("这个代码以前用过", 401));
  // }

  // const now = moment();

  // const diff = now.diff(Number(user.codePassTime), "m");

  // if (req.params.code == user.codePass && diff >= 2) {
  //   // return next(new ErrorResponse("This code has been used before", 401));
  //   return next(new ErrorResponse("代码过期", 401));
  // }
  console.log("req.params.pass", req.params.pass);

  const user = await User.findOneAndUpdate(
    { _id: userFind._id },
    {
      password: req.params.pass,
      codeUsedPass: true,
    },
    { new: true }
  );
  console.log("user>>>>>>>", user);

  sendTokenResponse(user, 200, res);

  // return res.status(200).json({
  //   success: true,
  //   code,
  // });
});



// @desc    Reset password
// @route   POST /api/v1/users/auth/resetpassword
// @access  Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
    // return next(new ErrorResponse("令牌无效", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});



// @desc    Picture Profile
// @route   PUT /api/v1/users/auth/pictureprofile
// @access  Private
exports.pictureProfile = asyncHandler(async (req, res, next) => {
  // console.log("req.body.pictureProfile", req.body.pictureProfile);
  const fy = JSON.stringify(req.body);

  const newData = JSON.parse(fy);

  const { pictureProfile } = newData;

  // console.log("pictureProfile", pictureProfile);

  // find user and update add profile photo
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { pictureProfile: pictureProfile },
    { new: true }
  );

  // console.log("user", user);

  res.status(200).json({
    success: true,
    data: user,
  });
});



// @desc    Picture Profile
// @route   PUT /api/v1/users/auth/addpoint
// @access  Private
exports.addPoint = asyncHandler(async (req, res, next) => {
  // find user and update add profile photo
  const user = await User.findById(req.params.id);
  const lastPoints = user.points + req.body.mount;

  await user.updateOne(
    {
      points: lastPoints,
    },
    { new: true, strict: false }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});




// @desc    Seen user if isActive == true
// @route   GET /api/v1/users/auth/seen
// @access  Private
exports.seenUser = asyncHandler(async (req, res, next) => {
  // id me
  const userId = req.user._id;

  // find user
  const users = await User.findById(userId);

  if (!users) {
    return next(new ErrorResponse("invalid users", 404));
    // return next(new ErrorResponse("无效用户", 404));
  }

  if (users.seen) {
    return res.status(200).json({
      success: false,
      message: "user already seen",
    });
  }

  // seen == true
  await User.findByIdAndUpdate(
    userId,
    { seen: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: data,
  });
});

// @desc      Get all admins
// @route     GET /api/v1/admins/admin/all
// @access    Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const allUser = await User.find();

  console.log(">>.", allUser);

  if (!allUser) {
    return next(new ErrorResponse("users not found", 400));
  }

  res.status(200).json({
    success: true,
    data: allUser,
  });
});

// @desc      Get all admins
// @route     GET /api/v1/admins/admin/all
// @access    Private
exports.activeUser = asyncHandler(async (req, res, next) => {
  const isSuperAdmin = req.user.group.includes("superAdmin");
  const isAdmin = req.user.group.includes("admin");

  if (isSuperAdmin || isAdmin) {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isActive: true,
    });
    try{
      const log = {
      admin : {username : req.user.username , phone : req.user.phone , adminRole : req.user?.adminRole ,group : req.user?.group , firstName : req.user?.firstName , lastName : req.user?.lastName},
      section : "User",
      part : "Active User",
      success : true,
      description : `${req.user.username} successfully activate user : ${user.username}`,
    }
    await newLog(log)
   }catch(err){
       console.log(err)
   }
    return res.status(200).json({
      success: true,
    });
  }

  res.status(401).json({
    success: false,
    error: "not access to this route",
  });
});
exports.deActiveUser = asyncHandler(async (req, res, next) => {
  const isSuperAdmin = req.user.group.includes("superAdmin");
  const isAdmin = req.user.group.includes("admin");

  if (isSuperAdmin || isAdmin) {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });
    try{
      const log = {
      admin : {username : req.user.username , phone : req.user.phone , adminRole : req.user?.adminRole ,group : req.user?.group , firstName : req.user?.firstName , lastName : req.user?.lastName},
      section : "User",
      part : "DeActive User",
      success : true,
      description : `${req.user.username} successfully DeActivate user : ${user.username}`,
    }
    await newLog(log)
   }catch(err){
       console.log(err)
   }
    return res.status(200).json({
      success: true,
    });
  }

  res.status(401).json({
    success: false,
    error: "not access to this route",
  });
});


exports.checkPhone = asyncHandler(async (req, res, next) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  // console.log(req.params.phone);
  function checkFirstLetterSpecial(_string) {
    let spCharsRegExp = /^[86]+/;
    return spCharsRegExp.test(_string);
  }

  if (!req.params.phone) {
    return next(new ErrorResponse("Please add a phone", 403));
  }

  const existingUser = await User.findOne({ phone: req.params.phone });

  if (!existingUser) {
    return next(new ErrorResponse("The phone number is wrong", 403));
  }

  await existingUser.updateOne(
    {
      codeUsed: false,
      code,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const fy = JSON.stringify(req.body);

  const newData = JSON.parse(fy);

  const { password } = newData;
  const user = await User.findById(req.user._id).select("+password");

  if (!user.codeUsed) {
    return next(
      new ErrorResponse("You are not allowed to change the password", 403)
    );
  }
  user.password = password;
  await user.save();
  // await User.findOneAndUpdate(req.user._id, {});

  sendTokenResponse(user, 200, res);
});



exports.changeUsername = asyncHandler(async (req, res, next) => {
  const code = Math.floor(Math.random() * 90000) + 10000;

  if (!req.params.username) {
    return next(new ErrorResponse("Please add username", 401));
  }
  const existingUser = await User.findById(req.user._id);

  if (!existingUser) {
    return next(new ErrorResponse("User not found", 404));
  }

  // console.log("username", req.params.username);

  let userNew;
  const findUsername = await User.findOne({ username: req.params.username });
  if (findUsername) {
    userNew = req.params.username + code;
  }
  // console.log("userNew", userNew);

  await existingUser.updateOne(
    {
      username: userNew ? userNew : req.params.username,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});



// @desc      Get all admins
// @route     GET /api/v1/admins/admin/all
// @access    Private
exports.addGroup = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("users not found", 400));
  }
  // console.log("req.body.group", req.body.group);

  await User.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { group: req.body.group },
    },
    {
      upsert: true,
      multi: true,
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});



// @desc      Log user out / clear cookie
// @route     GET /api/v1/admins/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true });
});


// @desc      Log user out / clear cookie
// @route     GET /api/v1/admins/auth/logout
// @access    Private
exports.checkToken = asyncHandler(async (req, res, next) => {
  const check = await User.findById(req.user._id);
  // console.log("]]]]]]]]]]]]]]]]]]]", check);
  if (check) {
    res.status(200).json({ success: true, data: check });
  } else {
    console.log("check", check);
    res.status(200).json({ success: false });
  }
});

exports.sms = asyncHandler(async (req, res, next) => {
  const { phone, code } = req.body;
  // console.log("formData>>>>>>>>>>", formData);
  const url = "http://101.37.254.178:9001/sms/service/postSend";

  const rawResponse = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: "SMS_ZJJHZ",
      password: "71dbf7956897863ea19ca598c5068da6",
      // mobile: `${phone}`
      mobile: `${13081988087}`,
      content: `【宁波哥伦布】您的验证码是${code}。`,
      sender: "GLBNET",
    }),
  });

  const response = await rawResponse.json();

  console.log("response>>>>>>>>>>>>>>>", response);

  res.status(200).json({ success: true, data: response,code });
});

exports.requestBank = asyncHandler(async (req, res, next) => {
  const resBank = await request();

  res.status(200).json({ success: true });
});



// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const isAdmin = user.group.includes("admin");
  const isSuperAdmin = user.group.includes("superAdmin");
  let options;
  let users;

  if (isAdmin || isSuperAdmin) {
    options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE_ADMIN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  } else {
    options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  }

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  if (!isAdmin && !isSuperAdmin) {
    users = {
      _id: user._id,
      isActive: user.isActive,
      phone: user.phone,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      pictureProfile: user.pictureProfile,
      group: user.group,
      complete: user.complete,
      group: user.group,
      points:user.points,
      totalInvitedUser:user.totalInvitedUser
      
    };
  } else {
    users = {
      _id: user._id,
      isActive: user.isActive,
      phone: user.phone,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName, 
      fullName: user.fullName,
      email: user.email,
      pictureProfile: user.pictureProfile,
      group: user.group,
      complete: user.complete,
      group: user.group,
      accessArray: user.accessArray,
      points:user.points,
      totalInvitedUser:user.totalInvitedUser,
      adminRole : user.adminRole
    };
  }

  console.log("token", token);
  console.log("users", users);

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    walletAmount:user.walletAmount,
    data: users,
  });
};


exports.totalData = asyncHandler(async (req, res, next) => {
    console.log( req.headers['x-forwarded-for'])
  const yaer = moment().year().toString();
  const day = moment().day().toString();
  const month = moment().month().toString();
  console.log('day and yead>>>' , moment().toString())
  const start_date_of_the_year = moment(yaer).format("YYYY-MM-DD");
  const end_date_of_the_year = moment(yaer).endOf("year").format("YYYY-MM-DD");

  const allUser = await User.find();
  
  
  let Truck = 0;
  let transport = 0;
  let commerce = 0;
  let linemaker = 0;
  let USER = 0;
  allUser.forEach(elem=>{
    if (elem.isActive == true){
        USER+=1
        if (elem.group.includes("truck")){
            Truck+=1
        } 
        if(elem.group.includes("commerce")){
            commerce += 1
        }
        if(elem.group.includes("transport")){
            transport += 1;
        }
        if(elem.group.includes("lineMaker")){
            linemaker += 1;
        }
    }
    // console.log(moment(elem.createdAt).day())
  })
  
  
    
//   let lastTruck = Truck;
//   let lasttransport = transport;
//   let lastcommerce = commerce;
//   let lastlinemaker = linemaker;
//   let lastUSER = USER;
  const data = await lastUsers.findOne({name : "userCounter"})
  console.log('da>>>' , data)
  lastTruck = data.Truck
  lasttransport = data.transport
  lastcommerce=data.commerce
  lastlinemaker=data.linemaker
  lastUSER = data.USER
  
    
  
  const allUserAddInYear = await User.find({
    createdAt: { $gte: start_date_of_the_year, $lte: end_date_of_the_year },
  });

  const countOfAllUser = allUser.length;
  const contOfAllUserAddInYear = allUserAddInYear.length;

  // truckCount = allUser.map(user => user.group.includes("truck").filter(f => f === false))
  const truckCount = allUser
    .map((user) => user.group.includes("truck") && user)
    .filter((f) => f !== false).length;
  const truckCountAddInYear = allUserAddInYear
    .map((user) => user.group.includes("truck") && user)
    .filter((f) => f !== false).length;
  const commerceCount = allUserAddInYear
    .map((user) => user.group.includes("commerce") && user)
    .filter((f) => f !== false).length;
  const commerceCountAddInYear = allUserAddInYear
    .map((user) => user.group.includes("commerce") && user)
    .filter((f) => f !== false).length;
  const transportCount = allUserAddInYear
    .map((user) => user.group.includes("transport") && user)
    .filter((f) => f !== false).length;
  const transportCountAddInYear = allUserAddInYear
    .map((user) => user.group.includes("transport") && user)
    .filter((f) => f !== false).length;
  const lineMakerCount = allUserAddInYear
    .map((user) => user.group.includes("lineMaker") && user)
    .filter((f) => f !== false).length;
  const lineMakerCountAddInYear = allUserAddInYear
    .map((user) => user.group.includes("lineMaker") && user)
    .filter((f) => f !== false).length;

  
  
  
  
  const truckPersent =  ((Truck-lastTruck)/lastTruck)*100
  const commercePersent = ((commerce-lastcommerce)/lastcommerce)*100
  const transportPersent = ((transport-lasttransport)/lasttransport)*100
  const lineMakerPersent = ((linemaker-lastlinemaker)/lastlinemaker)*100
  const userperc = ((USER-lastUSER)/lastUSER)*100



     console.log('now' , transport)
  console.log('last' , lasttransport)
  console.log('perc' , transportPersent)


  console.log('prt' , truckPersent)

  const allUserObject = {
    title: "Total Users",
    count: USER,
    percentage: (userperc) ? userperc : 0,
    diffrent :USER-lastUSER ,
    extra: contOfAllUserAddInYear,
  };
  
  const allTruckObject = {
    title: "Total Trucks",
    count: Truck,
    percentage: (truckPersent) ? truckPersent : 0,
    diffrent :Truck-lastTruck ,
    extra: truckCountAddInYear,
  };
  
  const allCommerceObject = {
    title: "Total Commrece",
    count: commerce,
    percentage: (commercePersent) ? commercePersent : 0,
    diffrent :commerce-lastcommerce,
    extra: commerceCountAddInYear,
  };
  const allTransportObject = {
    title: "Total Transportation companies",
    count: transport,
    percentage: (transportPersent) ? transportPersent : 0,
    diffrent :transport-lasttransport,
    extra: transportCountAddInYear,
  };
  const allLineMakertObject = {
    title: "Total lineMakers",
    count: linemaker,
    percentage: (lineMakerPersent) ? lineMakerPersent : 0,
    diffrent :linemaker-lastlinemaker,
    extra: lineMakerCountAddInYear,
  };
  
  console.log(allUserObject)
  console.log(allTruckObject)
  console.log(allCommerceObject)
  console.log(allTransportObject)
  console.log(allLineMakertObject)
  
  res.status(200).json({
    success: true,
    allUserObject,
    allTruckObject,
    allCommerceObject,
    allTransportObject,
    allLineMakertObject,
  });
});



exports.getDeviceToken = asyncHandler(async (req, res, next) => {
  let isExist = false;
  let updateDeviceToken;
  const { deviceToken } = req.body;
  console.log('device token>>>>>' , req.body)
  const user = await User.findById(req.user._id);
  console.log(user);
  if (!user) {
    return next(new ErrorResponse("user not exist", 403));
  }
  const deviceTokenArray = user.deviceToken;

  if (!deviceTokenArray) {
    return next(new ErrorResponse("device token not found", 403));
  }
  if (deviceTokenArray.length == 0) {
    updateDeviceToken = [...deviceTokenArray, deviceToken];
  } else {
    console.log("device token ", deviceTokenArray);

    deviceTokenArray.forEach((item) => {
      console.log(item == deviceToken);
      item == deviceToken ? (isExist = true) : isExist;
    });
    isExist
      ? (updateDeviceToken = updateDeviceToken)
      : (updateDeviceToken = [...deviceTokenArray, deviceToken]);
  }
  console.log(updateDeviceToken);

  await User.findByIdAndUpdate(req.user._id, {
    deviceToken: updateDeviceToken,
  });
  res.status(200).json({ success: true });
});
exports.removeDeviceToken = asyncHandler(async (req, res, next) => {
  const { deviceToken } = req.body;

  // const user = await User.findByIdAndUpdate(req.user._id, {
  //   $pull: { deviceToken: deviceToken },
  // });
  await User.updateMany({},{
    deviceToken:[]
  })
  res.status(200).json({ success: true });
});



exports.updateAdmin = asyncHandler(async (req, res, next) => {
  // const number="10000000"
  // const accessarray=number.split("")
  // const base10=parseInt(number,2)
  // const base2=base10.toString(2)
  // console.log("decimal of access number",base10);
  // console.log("base 2 of decimal number",base2);
  // console.log("array of base2 number",accessarray)
  const isSuperAdmin = req.user.group.includes("superAdmin");
  // const isAdmin=req.user.group.includes("admin")

  const { id , phone, username , firstName, lastName , password , adminRole } = req.body;
  if (!isSuperAdmin) {
    return next(new ErrorResponse("SuperAdmin just access this route", 401));
  }


  const accessArray = await adminGroup.findById(adminRole)
  
  const user = await User.findByIdAndUpdate(id, {
    phone,
    username,
    firstName,
    lastName,
    adminRole : [{name : accessArray.name , id : adminRole }],
    password,
    accessArray : accessArray.accessArray,
  });
  
  const updateRole = await adminGroup.findByIdAndUpdate(adminRole , {$addToSet : {members : {id : id , username : username}}})
  try{
      const log = {
      admin : {username : req.user.username , phone : req.user.phone , adminRole : req.user?.adminRole ,group : req.user?.group , firstName : req.user?.firstName , lastName : req.user?.lastName},
      section : "Admin",
      part : "Update Admin",
      success : true,
      description : `${req.user.username} successfully update Admin : ${user.username} to ${phone}, ${username} , ${firstName} , ${lastName} , ${password} , ${accessArray.name}`,
    }
    await newLog(log)
   }catch(err){
       console.log(err)
   }
  res.status(201).json({ success: true });
});
// exports.removeDeviceToken = asyncHandler(async (req, res, next) => {
//   const { deviceToken } = req.body;

//   const user = await User.findByIdAndUpdate(req.user._id, {
//     $pull: { deviceToken: deviceToken },
//   });
//   res.status(200).json({ success: true });
// });

exports.getChartInfo = asyncHandler(async (req, res, next) => {
  const groups = req.user.group;
  const isCommerce = groups.includes("commerce");
  const isTransport = groups.includes("transport");
  const isTruck = groups.includes("truck");

  if (isCommerce) {
    const chartInfo = await getInfoForChartCommerce();
    if (chartInfo.success) {
      return res
        .status(200)
        .json({ success: true, chartInfo: chartInfo.mainArray });
    } else {
      return next(new ErrorResponse("Resource not found", 404));
    }
  }
  if (isTransport) {
    const chartInfo = await getInfoForChartTransport();
    console.log("sssssss");
    console.log(chartInfo);
    if (chartInfo.success) {
      return res
        .status(200)
        .json({ success: true, chartInfo: chartInfo.mainArray });
    } else {
      return next(new ErrorResponse("Resource not found", 404));
    }
  }
  if (isTruck) {
    const chartInfo = await getInfoForChartTruck();
    if (chartInfo.success) {
      return res
        .status(200)
        .json({ success: true, chartInfo: chartInfo.mainArray });
    } else {
      return next(new ErrorResponse("Resource not found", 404));
    }
  }
});

exports.generateQrUrlForInvite = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const username=req.user.username
  const URL = `${username}//${userId}`;
  
  
  res.status(200).json({ success: true, qrUrl: URL });
});

exports.inviteUrlAddPoint = asyncHandler(async (req, res, next) => {
  
  const points = await getPointAmount();
  const pointAmount = points.points[0].inviteUser;
  const user = await User.findById(req.params.id);
  const userPoints = user.points + pointAmount;
  const userInviteNumber=user.totalInvitedUser+1
  const result = await User.findByIdAndUpdate(req.params.id, {
    points: userPoints,
    totalInvitedUser:userInviteNumber
  });
  res.status(201).json({ success: true, userPoint: userPoints,userInviteNumber });
});


exports.smsCheckOk = asyncHandler(async (req, res, next) => {
  const phone=req.params.phone
  const code=req.params.code

  console.log(phone);
  console.log(code);

  const response= await sendSmsTest(phone,code)

  console.log("response",response.date.response.status);

  res.status(200).json({ success: true,response:response});
});



