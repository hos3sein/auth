const Sales = require("../models/Sales");
const Buy = require("../models/Buy");
const BussinessMan = require("../models/BussinessMan");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const {pushNotificationStatic}=require("../utils/pushNotif")
const {walletUpdater,walletUpdaterApp}=require("../utils/wallet")
const {
  changeStatus,
  changeStatuscommerce,
  createUserL,
  createPendingL,
  createLineMaker,
  findTransport,
  msgInqury,
  addRefresh,
  notification,
  pushNotification,
  getFavoriteOrders,
  getFavoriteOrderAdmin,
  getFavoriteOrdersAdmin,
  transportInspection,
  cancelInquery,
  cancelInqueryOtherTransport,
  getAllVarible
} = require("../utils/request");
const { refresh, refreshGT,refreshGC,refreshOneOrder } = require("../utils/refresh");
const moment = require("moment");
const { without } = require("lodash");
//? Create Sales
exports.createSales = asyncHandler(async (req, res, next) => {
  
  let recipient
  let sender
  const {
    productType,
    productName,
    labReport,
    grade,
    quantity,
    fineness,
    flashPoint,
    waterContent,
    address,
    phoneNumber,
    lineMaker, 
    dateFrom,
    dateTo,
    shipmentAmount,
    closingDate,
    price,
    maxPrice,
    autoPrice,
    note,
    type,
    origin
  } = req.body;
  const findCompany = await BussinessMan.findOne({ "user._id": req.user._id });
  console.log(findCompany);
  const user = {
    _id: req.user._id,
    idCompany: findCompany._id,
    profileCompany: findCompany.profileCompany,
    companyName: findCompany.companyName,
    phone: req.user.phone,
  };
   const create = await Sales.create({
      user: user,
      productType,
      productName,
      labReport,
      grade,
      quantity,
      fineness,
      flashPoint,
      waterContent,
      finenessOrginal: fineness,
      flashPointOrginal: flashPoint,
      waterContentOrginal: waterContent,
      address,
      phoneNumber,
      lineMaker,
      dateFrom,
      dateTo,
      shipmentAmount,
      closingDate,
      price,
      raisedPrice: price,
      lastPrice: price,
      maxPrice,
      autoPrice,
      note,
      type,
      origin,
      status: 0,
    });
  await refreshGC()
  res.status(200).json({
    success: true,
    data: create,
  });
});

// Ok
exports.allSalesMe = asyncHandler(async (req, res, next) => {
  

  console.log(req.user._id);

  // let arr = [];
  // for (let i = 0; i < allMe.length; i++) {
  //   const elm = allMe[i];

  //   // agar seller bodam
  //   if (elm.type == 0 && elm.user._id.toString() == req.user._id.toString()) {
  //     if (!arr.some((el) => el._id === elm._id)) {
  //       // console.log("2222222222");
  //       await arr.push(elm);
  //     }
  //   }

  //   // console.log(
  //   //   "elm.type == 1 && elm.userTo._id.toString() == req.user._id.toString()",
  //   //   elm.type == 1 && elm.userTo._id.toString() == req.user._id.toString()
  //   // );

  //   // agar buyer daram
  //   if (elm.type == 1 && elm.userTo._id.toString() == req.user._id.toString()) {
  //     if (!arr.some((el) => el._id === elm._id)) {
  //       // console.log("3333333333333");
  //       await arr.push(elm);
  //     }
  //   }

  //   // agar to contract bod va man tosh bod type seller bod va man buyer bodam
  //   if (
  //     elm.type == 0 &&
  //     elm.status >= 4 &&
  //     elm.userTo._id.toString() == req.user._id.toString()
  //   ) {
  //     // console.log(">>>>>>>>>>>>>>>>>>>.");
  //     if (!arr.some((el) => el._id === elm._id)) {
  //       // console.log("444444444444");
  //       await arr.push(elm);
  //     }
  //   }

  //   // agar to contract bod va man tosh bod type buyer bod va man seller boda
  //   if (
  //     elm.type == 1 &&
  //     elm.status >= 4 &&
  //     elm.user._id.toString() == req.user._id.toString()
  //   ) {
  //     // console.log("55555555555");
  //     if (!arr.some((el) => el._id === elm._id)) {
  //       await arr.push(elm);
  //     }
  //   }

  //   for (let j = 0; j < elm.bids.length; j++) {
  //     const item = elm.bids[j];

  //     // agar pishnahad dadam
  //     if (item.userId.toString() == req.user._id.toString() && elm.status < 4) {
  //       if (!arr.some((el) => el._id === elm._id)) {
  //         // console.log("111111111111");
  //         await arr.push(elm);
  //       }
  //     }
  //   }
  // }

  // //   {
  // //     bids: { $elemMatch: { userId: req.user._id } },
  // //   }
  // // ]),
  

  

  const newQuery=await Sales.find({
    $or:[
      {"user._id":req.user._id},
      {"userTo._id":req.user._id},
      {bids:{ $elemMatch: { userId:req.user._id}}},
    ]
  }).sort({ createdAt: -1 })

  // console.log(arr.length);

  

  res.status(200).json({
    success: true,
    data: newQuery,
  });
});

// Ok
exports.allSalesWithToken = asyncHandler(async (req, res, next) => {
  const all = await Sales.find({
    quantity: { $ne: 0 },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: all,
  });
});

// Ok
exports.allSales = asyncHandler(async (req, res, next) => {
  // const all = await Sales.find({
  //   $or: [{ status: 0 }, { status: 1 }, { status: 2 }, { status: 3 }],
  // }).sort({ createdAt: -1 });
  
  

  // let arrNew = [];
  // for (let j = 0; j < all.length; j++) {
  //   const elm = all[j];

  //   if (!elm.cancel) {
  //     if (
  //       elm.bids.length == 0 &&
  //       elm.type == 0 &&
  //       elm.user._id.toString() != req.user._id.toString()
  //     ) {
  //       arrNew.push(elm);
  //     }

  //     if (
  //       elm.bids.length == 0 &&
  //       elm.type == 1 &&
  //       elm.userTo._id.toString() != req.user._id.toString()
  //     ) {
  //       arrNew.push(elm);
  //     }

  //     for (let k = 0; k < elm.bids.length; k++) {
  //       const item = elm.bids[k];
        
  //       if (
  //         (elm.type == 0 &&
  //           elm.user._id != req.user._id &&
  //           item.userId.toString() != req.user._id.toString()) ||
  //         (elm.type == 1 &&
  //           elm.userTo._id != req.user._id &&
  //           item.userId.toString() != req.user._id.toString())
  //       ) {
  //         if (!arrNew.some((el) => el._id === elm._id)) {
  //           arrNew.push(elm);
  //         }
  //       }
  //     }
  //   }
  // }

  // let arr = [];
  // for (let i = 0; i < all.length; i++) {
  //   const element = all[i];
  //   // console.log("element.user", typeof element.user.phone);
  //   // console.log("element.userTo", element?.userTo);

  //   // console.log(
  //   //   "element.user && !element.userTo",
  //   //   element.user && !element.userTo
  //   // );

  //   if (element?.user.phone && !element?.userTo.phone) {
  //     // console.log("element?.user", element?.user);
  //     if (element?.user._id.toString() !== req.user._id.toString()) {
  //       arr.push(element);
  //     }
  //   }
  //   // console.log(
  //   // "element?.userTo && !element?.user",
  //   // element?.userTo && !element?.user
  //   // );

  //   if (element?.userTo.phone && !element?.user.phone) {
  //     // console.log("element?.userTo", element?.userTo);
  //     if (element?.userTo._id.toString() !== req.user._id.toString()) {
  //       arr.push(element);
  //     }
  //   }

  //   if (element?.userTo.phone && element?.user.phone) {
  //     // console.log(
  //     //   "element?.userTo && element?.user",
  //     //   element?.userTo && element?.user
  //     // );
  //     if (
  //       element?.userTo._id.toString() !== req.user._id.toString() &&
  //       element?.user._id.toString() !== req.user._id.toString()
  //     ) {
  //       arr.push(element);
  //     }
  //   }
  // }

  

 
  const newResult=await Sales.find({
    $and:[
      {status:{$lt:4}},
      {cancel:false},
      {"user._id":{$ne:req.user._id}},
      {"userTo._id":{$ne:req.user._id}},
      {bids: {$ne:{ $elemMatch: { userId:req.user._id}}}}
    ]
  }).sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data:newResult,
  });
});

// update
// felan vase test
exports.update = asyncHandler(async (req, res, next) => {
  const find = await Sales.findById(req.params.id);

  await find.updateOne({
    labReport: req.body.labReport,
  });

  res.status(200).json({
    success: true,
    data: find,
  });
});

// buy sample and sales request
exports.buy = asyncHandler(async (req, res, next) => {
  const {
    origin,
    destination,
    phoneNumber,
    labReport,
    dateFrom,
    dateTo,
    shipmentAmount,
    lineMaker,
    fineness,
    flashPoint,
    waterContent,
    priceTransportCompany,
    price,
    raisedPrice,
    maxPrice,
    autoPrice,
    quantity,
    type,
  } = req.body;

  const findBuyer = await BussinessMan.findOne({
    "user._id": req.user._id,
  });

  const buyer = {
    _id: req.user._id,
    idCompany: findBuyer._id,
    profileCompany: findBuyer.profileCompany,
    companyName: findBuyer.companyName,
    phone: req.user.phone,
  };

  const findCheck = await Buy.find({
    $and: [{ "buyer._id": req.user._id }, { type: type }],
  });

  if (findCheck.length) {
    return next(new ErrorResponse("you are before buy", 401));
  }

  const find = await Sales.findById(req.params.sales);

  // agar find seller bod
  const create = await Buy.create({
    seller: find.type == 0 ? find.user : buyer,
    buyer: find.type == 1 ? buyer : find.user,
    origin: find.type == 0 ? find.address : origin,
    destination: find.type == 1 ? find.address : destination,
    salse: req.params.sales,
    phoneNumber,
    labReport,
    dateFrom,
    dateTo,
    shipmentAmount,
    lineMaker,
    fineness,
    flashPoint,
    waterContent,
    priceTransportCompany,
    price,
    raisedPrice,
    maxPrice,
    autoPrice,
    quantity,
    type,
    status: 0,
  });

  await refresh(req.user._id, "refreshCommerce");
  await refresh(find.seller._id, "refreshCommerce");

  res.status(200).json({
    success: true,
    data: create,
  });
});

exports.buyMe = asyncHandler(async (req, res, next) => {
  const all = await Buy.find({
    "buyer._id": req.user._id,
  }).populate({ path: "salse", options: { strictPopulate: false } });

  res.status(200).json({
    success: true,
    data: all,
  });
});

exports.sellMe = asyncHandler(async (req, res, next) => {
  const all = await Buy.find({
    "seller._id": req.user._id,
  })
    .populate({ path: "salse", options: { strictPopulate: false } })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: all,
  });
});

// ok
// change status end contract
exports.changeStatus = asyncHandler(async (req, res, next) => {
  const find = await Buy.findById(req.params.id);

  // const result = await changeStatus(find.salse, req.params.status);

  await find.updateOne({
    status: req.params.status,
  });

 

  await refresh(find.buyer._id, "refreshCommerce");
  await refresh(find.seller._id, "refreshCommerce");
  await refreshGC();
  await refreshGC();

  res.status(200).json({
    success: true,
    data: find,
  });
});

// change status end contract
exports.changeStatusSales = asyncHandler(async (req, res, next) => {
  const allV=await getAllVarible()
  const deposteAmount=allV.commerceDepositeAmount
  const comi=allV.appComistionAmount


  let title;
  let message;
  let recipient;
  let sender;
  let isAuto=false
  // let isEnd=false

  const find = await Sales.findById(req.params.id);
  const last = find.statusTime[find.statusTime.length - 1];

  const newStatus = find.status + 1;
  if(newStatus>10){
    return next(new ErrorResponse("order end you cant change Status",400))
  }

  // if(newStatus==10){
  //  isEnd=true
  // }
  const time = {
    status: newStatus,
    action: last.action + 1,
    at: Date.now(),
  };
  
  const requsterUserIdForTransport=(find.type==0)?find.userTo._id:find.user._id
  
  if(find.haveTransport){
    const result = await changeStatuscommerce(req.params.id,newStatus,last.action + 1,requsterUserIdForTransport);
  }
  await Sales.findByIdAndUpdate(req.params.id, {
    status: newStatus,
    $addToSet: { statusTime: time },
    // end:isEnd
  });

  if (find.type == 0 && newStatus == 5) {
    title = "you must pay deposite";
    message = "you must pay deposite in app";
    number=5
    recipient = {
      _id: find.user._id,
      username: find.user.companyName,
      pictureProfile: find.user.profileCompany,
    };
    sender = {
      _id: find.userTo._id,
      username: find.userTo.companyName,
      pictureProfile: find.userTo.profileCompany,
    };
    // //!wallet section
    const amount=(find.raisedPrice)*100
    if(find.haveTransport){
      const transportAmount=(find.transportPrice*100)
      const transportTransAction=await walletUpdater(0,req.user._id,transportAmount,"Deposite ShipingCompany","transport")
      if(!transportTransAction.success){
        return next(new ErrorResponse("Wallet transaction failed",500))
      }
    }
    const bidTransAction=await walletUpdater(0,req.user._id,amount,"Deposite Commerce","commerce")
    if(!bidTransAction.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    const bidTransActionA=await walletUpdaterApp(1,req.user._id,amount,"Deposite Commerce","commerce")
    if(!bidTransActionA.success){
      return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
    }
    find.buyerDepositeInvoiceNumber=bidTransAction.data
    await find.save()
  }
  if (find.type == 0 && newStatus == 6) {
    console.log("ffff",deposteAmount);
    console.log("ffff",comi);
    title = "Are you ready to recive?";
    message = "When you ready to recive you must say it in app";
    number=9
    recipient = {
      _id: find.userTo._id,
      username: find.userTo.companyName,
      pictureProfile: find.userTo.profileCompany,
    };
    sender = {
      _id: find.user._id,
      username: find.user.companyName,
      pictureProfile: find.user.profileCompany,
    };
    console.log(find.raisedPrice);
    const depo=(find.raisedPrice)*(deposteAmount/100)
    const amount=depo*100
    
    const bidTransAction=await walletUpdater(0,req.user._id,amount,"deposite","commerce")
    console.log("user",bidTransAction);
    if(!bidTransAction.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    const bidTransActionA=await walletUpdaterApp(1,req.user._id,amount,"deposite","commerce")
    if(!bidTransActionA.success){
      return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
    }
    console.log("user",bidTransAction);
    console.log("app",bidTransActionA);
    find.sellerrDepositeInvoiceNumber=bidTransAction.data
    await find.save()
  }
  if (find.type == 0 && newStatus == 7) {
    number=10
    title = "Buyer ready to recive";
    message = "when you send you must say it in app ";
    recipient = {
      _id: find.user._id,
      username: find.user.companyName,
      pictureProfile: find.user.profileCompany,
    };
    sender = {
      _id: find.userTo._id,
      username: find.userTo.companyName,
      pictureProfile: find.userTo.profileCompany,
    };
  }
  if (find.type == 0 && newStatus == 8) {
    number=11
    title = "seller send the cargo";
    message = "when you recive cargo you shoud pay it";
    recipient = {
      _id: find.userTo._id,
      username: find.userTo.companyName,
      pictureProfile: find.userTo.profileCompany,
    };
    sender = {
      _id: find.user._id,
      username: find.user.companyName,
      pictureProfile: find.user.profileCompany,
    };
  }
  if (find.type == 0 && newStatus == 9) {
    number=12
    title = "Buyer pay ";
    message = "Buyer pay ";
    recipient = {
      _id: find.user._id,
      username: find.user.companyName,
      pictureProfile: find.user.profileCompany,
    };
    sender = {
      _id: find.userTo._id,
      username: find.userTo.companyName,
      pictureProfile: find.userTo.profileCompany,
    };
    const find = await Sales.findById(id);
    const last = find.statusTime[find.statusTime.length - 1];
    const newStatus = find.status + 1;
    const userId=find.user._id
    const comAmont=find.raisedPrice*(comi/100)
    const depo=find.raisedPrice*(deposteAmount/100)
    const amount=(find.raisedPrice+depo-comAmont)*100
    const bidTransAction=await walletUpdater(1,userId,amount,"deposite","commerce")
    if(!bidTransAction.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    const bidTransActionA=await walletUpdaterApp(0,userId,amount,"deposite","commerce")
    if(!bidTransActionA.success){
      return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
    }
    await find.save()
    if(newStatus>10){
      return next(new ErrorResponse("order end you cant change Status",400)) 
    }
    const requsterUserIdForTransport=find.userTo._id
    if(find.haveTransport){
      const result = await changeStatuscommerce(id,10,last.action + 1,requsterUserIdForTransport);
    }
    await Sales.findByIdAndUpdate(id, {
      status: newStatus,
      $addToSet: { statusTime: time },
      end:true
    });
  }
  await pushNotificationStatic(recipient._id,number) 
  const findSocket = await Sales.findById(req.params.id);
  await refreshOneOrder(findSocket)
  res.status(200).json({
    success: true,
    data: {
      status:newStatus
    },
  });
});

// ok
// ! in fek konm estefade beshe va notif dorost bekhad
// approve Buyer
exports.approveBuyer = asyncHandler(async (req, res, next) => {
  const sales = await Sales.findById(req.params.id);
  
  let userIdFind;
  sales.bids.find((item) => {
    if (item.bid == sales.bid) {
      userIdFind = item.userId;
    }
  });
  const buss = await BussinessMan.findOne({
    "user._id": userIdFind,
  });
  const obj = {
    _id: buss.user._id,
    idCompany: buss._id,
    profileCompany: buss.profileCompany,
    companyName: buss.companyName,
    phone: buss.user.phone,
  };
  const time = {
    status: 4,
    action: 0,
    at: Date.now(),
  };

  const findTrans = await findTransport(req.params.id,userIdFind);

   console.log("nice",findTrans);

  if (findTrans.success) {
  


    const cond=sales.user._id

    const condForcancel=sales.userTo._id

  

   const changeStatusresult= await changeStatus(cond,req.params.id)
   const cancelOtherShiing=await cancelInqueryOtherTransport(condForcancel,req.params.id)
    await Sales.findOneAndUpdate(
      {
        _id: req.params.id,
        "bids.bussId": buss._id,
      },
      {
        $set: {
          "bids.$.status": "accept",
        },
        $addToSet: { statusTime: time },
        status: 4,
        userTo: sales.type == 0 ? obj : sales.userTo,
        user: sales.type == 0 ? sales.user : obj,
        transportCompany: findTrans.data.transport,
        raisedPrice: sales.bid,
        transportStatus:4,
        haveTransport:true,
        transportPrice:findTrans.data.bid
      }
    );
  } else {
    
    await Sales.findOneAndUpdate(
      {
        _id: req.params.id,
        "bids.bussId": buss._id,
      },
      {
        $set: {
          "bids.$.status": "accept",
        },
        $addToSet: { statusTime: time },
        status: 4,
        userTo: sales.type == 0 ? obj : sales.userTo,
        user: sales.type == 0 ? sales.user : obj,
        raisedPrice: sales.bid,
      }
    );
    await cancelInquery(req.params.id)
  }
  const sender = {
    _id: sales.user._id,
    username: sales.user.companyName,
    pictureProfile: sales.user.profileCompany,
  };
  const recipient = {
    _id: sales.userTo._id,
    username: sales.userTo.companyName,
    pictureProfile: sales.userTo.profileCompany,
  };
  await pushNotificationStatic(recipient._id,2)
  await pushNotificationStatic(sender._id,2)
  await refreshGC()
  res.status(200).json({
    success: true,
    data: {},
  });
});



exports.createLineMaker = asyncHandler(async (req, res, next) => {
  const { phone, password, username } = req.body;

  const dataU = {
    phone: phone,
    password: password,
    username: username,
    group: ["lineMaker"],
  };

  const resultU = await createUserL(dataU);

  if (resultU.success) {
    const dataUser = {
      _id: resultU.data._id,
      username: username,
    };

    const findMe = await BussinessMan.findOne({ "user._id": req.user._id });

    // console.log("findMe>>>>>>>>>>>", findMe);

    const dataP = {
      group: "lineMaker",
      companyName: findMe.companyName,
      companyAddress: findMe.companyAddress,
      profileCompany: findMe.profileCompany,
      user: dataUser,
      status: 1,
    };
    const resultP = await createPendingL(dataP);
    if (resultP.success) {
      const dataLast = {
        group: "lineMaker",
        companyName: findMe.companyName,
        companyAddress: findMe.companyAddress,
        profileCompany: findMe.profileCompany,
        user: dataUser,
        bussinessMan: findMe._id,
      };
      const resultLast = await createLineMaker(dataLast);
    }
  }

  await refreshGC();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.bid = asyncHandler(async (req, res, next) => { 
  const { address } = req.body;

  console.log(address);

  const findBuyer = await BussinessMan.findOne({
    "user._id": req.user._id,
  });

  const find = await Sales.findById(req.params.sales);

  const findCheck = await Sales.find({
    $and: [
      {
        bids: { $elemMatch: { userId: req.user._id } },
      },
      { _id: req.params.sales },
    ],
  });

  if (find.type == 0) {
    if (
      (find.bid > 0 && find.bid < req.params.price) ||
      find.raisedPrice < req.params.price
    ) {
      if (findCheck.length) {
        await Sales.findOneAndUpdate(
          { _id: req.params.sales, "bids.status": "waiting" },
          {
            $set: {
              "bids.$.status": "reject",
            },
          },
          { new: true }
        );
         
        

        await Sales.findOneAndUpdate(
          {
            _id: req.params.sales,
            "bids.userId": req.user._id,
          },
          {
            $set: {
              "bids.$.bid": req.params.price,
              "bids.$.status": "waiting",
            },
            bid: req.params.price,
            status: 1,
            raisedPrice: req.params.price,
            addressTo: address,
            userTo: findBuyer.user,
          }
        );
        const sender = {
          _id: findBuyer.user._id,
          username: findBuyer.user.username,
          pictureProfile: findBuyer.user.profileCompany,
        };

        const recipient = {
          _id: find.user._id,
          username: find.user.companyName,
          pictureProfile: find.user.profileCompany,
        };

        await pushNotification(
          "bid price",
          "Some body bid to your order",
          "The bidder's bid was successful",
          recipient,
          sender,
          "commerceStack",
          "Order"
        );

        await notification(
          "bid price",
          recipient,
          sender,
          find._id,
          "Order",
          "Some body bid to your order",
          "The bidder's bid was successful"
        );

        await addRefresh(req.user._id, "refreshCommerce");
        await addRefresh(find.user._id, "refreshCommerce");

        await refresh(req.user._id, "refreshCommerce");
        await refresh(find.user._id, "refreshCommerce");

        return res.status(200).json({
          success: true,
          data: {},
        });
      }
      // vase refresh
      let wetId;
      find.bids.forEach(async (elm) => {
        if (elm.status == "waiting") {
          const f = await BussinessMan.findById(elm.driverId);
          wetId = f.user._id;
        }
      });

      // await Sales.findByIdAndUpdate(req.params.id, {
      //   // $pullAll: { drivers: { driverId: truck._id } },
      //   $pull: { bids: { bussId: truck._id } },
      // });

      await Sales.findOneAndUpdate(
        { _id: req.params.sales, "bids.status": "waiting" },
        {
          $set: {
            "bids.$.status": "reject",
          },
        },
        { new: true }
      );

      const bid = {
        bussId: findBuyer._id,
        userId: req.user._id,
        bid: req.params.price,
        status: "waiting",
        at: moment(),
      };

      await Sales.findByIdAndUpdate(req.params.sales, {
        $addToSet: { bids: bid },
        bid: req.params.price,
        status: 1,
        raisedPrice: req.params.price,
        addressTo: address,
        userTo: findBuyer.user,
      });
      const sender = {
        _id: findBuyer.user._id,
        username: findBuyer.user.username,
        pictureProfile: findBuyer.user.profileCompany,
      };

      const recipient = {
        _id: find.user._id,
        username: find.user.companyName,
        pictureProfile: find.user.profileCompany,
      };

      await pushNotification(
        "bid price",
        "Some body bid to your order",
        "The bidder's bid was successful",
        recipient,
        sender,
        "commerceStack",
        "Order"
      );

      await notification(
        "bid price",
        recipient,
        sender,
        find._id,
        "Order",
        "The bidder's bid was successful",
        "The bidder's bid was successful"
      );

      await addRefresh(req.user._id, "refreshCommerce");
      await addRefresh(find.user._id, "refreshCommerce");

      await refresh(req.user._id, "refreshCommerce");

      await refresh(find.user._id, "refreshCommerce");
    } else {
      return next(new ErrorResponse("出价不得低于当前价格", 404));
    }
  }

  if (find.type == 1) {
    if (find.bid > req.params.price || find.raisedPrice > req.params.price) {
      // vase refresh
      let wetId;
      find.bids.forEach(async (elm) => {
        if (elm.status == "waiting") {
          const f = await BussinessMan.findById(elm.driverId);
          wetId = f.user._id;
        }
      });

      // await Sales.findByIdAndUpdate(req.params.id, {
      //   // $pullAll: { drivers: { driverId: truck._id } },
      //   $pull: { bids: { bussId: truck._id } },
      // });

      await Sales.updateMany(
        { _id: req.params.id, "bids.status": "waiting" },
        {
          $set: {
            "bids.$.status": "reject",
          },
        },
        { new: true }
      );

      const bid = {
        bussId: findBuyer._id,
        userId: req.user._id,
        bid: req.params.price,
        status: "waiting",
        at: moment(),
      };

      await Sales.findByIdAndUpdate(req.params.sales, {
        $addToSet: { bids: bid },
        bid: req.params.price,
        status: 1,
        raisedPrice: req.params.price,
        user: findBuyer.user,
      });
      const sender = {
        _id: findBuyer.user._id,
        username: findBuyer.user.username,
        pictureProfile: findBuyer.user.profileCompany,
      };

      const recipient = {
        _id: find.userTo._id,
        username: find.userTo.companyName,
        pictureProfile: find.userTo.profileCompany,
      };

      await pushNotification(
        "bid price",
        "Some body bid to your order",
        "The bidder's bid was successful",
        recipient,
        sender,
        "commerceStack",
        "Order"
      );

      await notification(
        "bid price",
        recipient,
        sender,
        find._id,
        "Order",
        "The bidder's bid was successful",
        "The bidder's bid was successful"
      );
      await addRefresh(req.user._id, "refreshCommerce");
      await addRefresh(find.userTo._id, "refreshCommerce");

      await refresh(req.user._id, "refreshCommerce");
      await refresh(find.userTo._id, "refreshCommerce");
    } else {
      return next(new ErrorResponse("bid must kamtar bashe", 404));
    }
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.bidSaller = asyncHandler(async (req, res, next) => {
  const {
    labReport,
    fineness,
    flashPoint,
    waterContent,
    addressTo,
    address,
    phoneNumber,
    lineMaker,
  } = req.body;

  const findBuyer = await BussinessMan.findOne({
    "user._id": req.user._id,
  });

  const find = await Sales.findById(req.params.sales);
  console.log(find);

  const findCheck = await Sales.find({
    $and: [
      {
        bids: { $elemMatch: { userId: req.user._id } },
      },
      { _id: req.params.sales },
    ],
  });

  console.log(findCheck);

  if (find.type == 1) {
    if (
      (find.bid > 0 && find.bid > req.params.price) ||
      find.raisedPrice > req.params.price
    ) {
      if (findCheck.length) {
        await Sales.findOneAndUpdate(
          { _id: req.params.sales, "bids.status": "waiting" },
          {
            $set: {
              "bids.$.status": "reject",
            },
          },
          { new: true }
        );

        const user = {
          _id: req.user._id,
          idCompany: findBuyer._id,
          profileCompany: findBuyer.profileCompany,
          companyName: findBuyer.companyName,
          phone: req.user.phone,
        };

        await Sales.findOneAndUpdate(
          {
            _id: req.params.sales,
            "bids.userId": req.user._id,
          },
          {
            user,
            $set: {
              "bids.$.bid": req.params.price,
              "bids.$.status": "waiting",
            },
            labReport,
            fineness,
            flashPoint,
            waterContent,
            address,
            phoneNumber,
            lineMaker,
            bid: req.params.price,
            status: 1,
            raisedPrice: req.params.price,
          }
        );
        const sender = {
          _id: find.user._id,
          username: find.user.username,
          pictureProfile: find.user.profileCompany,
        };
  
        const recipient = {
          _id: find.userTo._id,
          username: find.userTo.companyName,
          pictureProfile: find.userTo.profileCompany,
        };
          await pushNotification(
        "bid price",
        "Some body bid to your order",
        "The bidder's bid was successful",
        recipient,
        sender,
        "commerceStack",
        "Order"
      );

        await addRefresh(req.user._id, "refreshCommerce");
        await addRefresh(find.userTo._id, "refreshCommerce");

        await refresh(req.user._id, "refreshCommerce");
        await refresh(find.userTo._id, "refreshCommerce");
        await refreshGC();

        return res.status(200).json({
          success: true,
          data: {},
        });
      }
      await Sales.findOneAndUpdate(
        { _id: req.params.sales, "bids.status": "waiting" },
        {
          $set: {
            "bids.$.status": "reject",
          },
        },
        { new: true }
      );

      const bid = {
        bussId: findBuyer._id,
        userId: req.user._id,
        bid: req.params.price,
        status: "waiting",
        at: moment(),
      };

      const user = {
        _id: req.user._id,
        idCompany: findBuyer._id,
        profileCompany: findBuyer.profileCompany,
        companyName: findBuyer.companyName,
        phone: req.user.phone,
      };

      await Sales.findByIdAndUpdate(req.params.sales, {
        user,
        $addToSet: { bids: bid },
        labReport,
        fineness: fineness,
        flashPoint: flashPoint,
        waterContent: waterContent,
        finenessOrginal: find.finenessOrginal,
        flashPointOrginal: find.flashPointOrginal,
        waterContentOrginal: find.waterContentOrginal,

        address,
        phoneNumber,
        lineMaker,
        bid: req.params.price,
        status: 1,
        raisedPrice: req.params.price,
      });

      const sender = {
        _id: find.user._id,
        username: find.user.companyName,
        pictureProfile: find.user.profileCompany,
      };

      const recipient = {
        _id: find.userTo._id,
        username: find.userTo.companyName,
        pictureProfile: find.userTo.profileCompany,
      };
      await pushNotification(
        "bid price",
        "Some body bid to your order",
        "The bidder's bid was successful",
        recipient,
        sender,
        "commerceStack",
        "Order"
      );
      await notification(
        "bid price",
        sender,
        recipient,
        find._id,
        "Sales",
        "报价者报价成功、",
        "报价者报价成功、"
      );

      await addRefresh(req.user._id, "refreshCommerce");
      await addRefresh(find.userTo._id, "refreshCommerce");

      await refresh(req.user._id, "refreshCommerce");
      await refresh(find.userTo._id, "refreshCommerce");
    } else {
      return next(new ErrorResponse("出价不得高于", 404));
    }
  }

  await addRefresh(req.user._id, "refreshCommerce");
  await addRefresh(find.userTo._id, "refreshCommerce");

  await refresh(req.user._id, "refreshCommerce");
  await refresh(find.userTo._id, "refreshCommerce");
  await refreshGC();
  // await refresh(req.user._id, "refreshCommerce");
  // await refresh(find.seller._id, "refreshCommerce");

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.msg = asyncHandler(async (req, res, next) => {
  const {text,image} = req.body;
  let sender
  let recipient
   
  console.log( "text",text);


  if(!text&&!image){
    return next(new ErrorResponse("text or image require", 400));
  }
  
  
  const message= {
    text: text,
    image:image ,
    user:req.user._id ,
    username:req.user.username ,
    phone:req.user.phone,
    pictureProfile:req.user.pictureProfile,
    at:Date.now()
  }

  
  const updateOrder=await Sales.findByIdAndUpdate(req.params.id,{
    $addToSet :{message}
  })
  console.log(updateOrder)
  console.log(updateOrder.user)
  console.log(updateOrder.userTo);

  if(updateOrder.user._id===req.user._id){
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile
    };
  
     recipient = {
      _id: updateOrder.userTo._id,
      username: updateOrder.userTo.username,
      pictureProfile: updateOrder.userTo.pictureProfile,
    };
  }else{
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile
    };
  
     recipient = {
      _id: updateOrder.user._id,
      username: updateOrder.user.username,
      pictureProfile: updateOrder.user.pictureProfile,
    };
  }

  await pushNotification(
    "message",
    `You have message`,
    "information",
    recipient,
    sender,
    "commerceStack",
    "Order"
  );
  await notification(
    "message",
    sender,
    recipient,
    updateOrder._id,
    "Order",
    "You have message",
    "information"
  );

  

  const findOrder = await Sales.findById(req.params.id);
  await refreshOneOrder(findOrder)

  res.status(201).json({
    success: true,
    data: {},
  });
});

exports.newMsgImage=asyncHandler(async (req, res, next) => {
  const { image } = req.body;
  let sender
  let recipient
  console.log( "image",image);
  if(!image){
    return next(new ErrorResponse("image require", 400));
  }

  const message= {
    text: "",
    image:image ,
    user:req.user._id ,
    username:req.user.username ,
    phone:req.user.phone,
    pictureProfile:req.user.pictureProfile,
    at:Date.now()
  }
  const updateOrder=await Sales.findByIdAndUpdate(req.params.id,{
    $addToSet :{message}
  })
  if(updateOrder.user._id===req.user._id){
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile
    };
  
     recipient = {
      _id: updateOrder.userTo._id,
      username: updateOrder.userTo.username,
      pictureProfile: updateOrder.userTo.pictureProfile,
    };
  }else{
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile
    };
  
     recipient = {
      _id: updateOrder.user._id,
      username: updateOrder.user.username,
      pictureProfile: updateOrder.user.pictureProfile,
    };
  }

  await pushNotification(
    "message",
    `You have message`,
    "information",
    recipient,
    sender,
    "commerceStack",
    "Order"
  );
  await notification(
    "message",
    sender,
    recipient,
    updateOrder._id,
    "Order",
    "You have message",
    "information"
  );

  

 
  refreshGC()

  res.status(201).json({
    success: true,
    data: {},
  });
});

exports.cancelSalesMe = asyncHandler(async (req, res, next) => {

  let recipient
  let sender
  const findOrder = await Sales.findById(req.params.id);

  // let  sender = {
  //   _id: findOrder.user._id,
  //   username: findOrder.user.companyName,
  //   pictureProfile: findOrder.user.profileCompany,
  // };

  // let recipient = {
  //   _id: findOrder.user._id,
  //   username: findOrder.user.companyName,
  //   pictureProfile: findOrder.user.profileCompany,
  // };

  if (findOrder.status == 1) {
    // return next(new ErrorResponse("this commerce exsiting bids", 401));
    
    //!paymet section
    const allV=await getAllVarible()
    const bidamount=allV.commerceBidAmount*100
    const cancelTransAction=await walletUpdater(1,findOrder.userTo._id,bidamount,"Cancel Bid Amount","Commerce")
    const cancelTransActionApp=await walletUpdaterApp(0,findOrder.userTo._id,bidamount,"Cancel Bid Amount","Commerce")
    if(!cancelTransAction.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    if(!cancelTransActionApp.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    await Sales.findOneAndUpdate(
      { _id: req.params.id },
      {
        cancel: true,
      },
      { strict: false }
    );
    if(findOrder.type==0){
      sender = {
        _id: findOrder.user._id,
        username: findOrder.user.companyName,
        pictureProfile: findOrder.user.profileCompany,
      };
      recipient = {
        _id: findOrder.userTo._id,
        username: findOrder.userTo.companyName,
        pictureProfile: findOrder.userTo.profileCompany,
      };
    } 
    if(findOrder.type==1){
      recipient = {
        _id: findOrder.user._id,
        username: findOrder.user.companyName,
        pictureProfile: findOrder.user.profileCompany,
      };
      sender = {
        _id: findOrder.userTo._id,
        username: findOrder.userTo.companyName,
        pictureProfile: findOrder.userTo.profileCompany,
      };
    } 
   

   
  
    await refreshGC();

    await pushNotification(recipient._id,16)
  
    // await pushNotification(
    //   "cancel",
    //   "You cancel Order",
    //   "information",
    //   recipient,
    //   sender,
    //   "commerceStack",
    //   "Order"
    // );
    // await pushNotification(
    //   "cancel",
    //   "You cancel Order",
    //   "information",
    //   sender,
    //   recipient,
    //   "commerceStack",
    //   "Order"
    // );
  
    return res.status(200).json({
      success: true,
      data: {},
    });
  }

  if (
    findOrder.type == 0 &&
    findOrder.user._id == req.user._id &&
    findOrder.status < 5 &&
    findOrder.status != 1
  ) {
    await Sales.findOneAndUpdate(
      { _id: req.params.id },
      {
        cancel: true,
      },
      { strict: false }
    );
  }

  if (
    findOrder.type == 1 &&
    findOrder.userTo._id == req.user._id &&
    findOrder.status < 5 &&
    findOrder.status != 1
  ) {
    await Sales.findOneAndUpdate(
      { _id: req.params.id },
      {
        cancel: true,
      },
      { strict: false }
    );
  }
  await cancelInquery(find._id)
  await refreshGC();
  await pushNotification(recipient._id,16)

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.cancelOredr = asyncHandler(async (req, res, next) => {
  let recipient
  let sender

const find = await Sales.findById(req.params.id);
   
const allV=await getAllVarible()
const bidamount=allV.commerceBidAmount*100
const cancelTransAction=await walletUpdater(1,find.userTo._id,bidamount,"Cancel Bid Amount","Commerce")
const cancelTransActionApp=await walletUpdaterApp(0,find.userTo._id,bidamount,"Cancel Bid Amount","Commerce")
if(!cancelTransAction.success){
  return next(new ErrorResponse("Wallet transaction failed",500))
}
if(!cancelTransActionApp.success){
  return next(new ErrorResponse("Wallet transaction failed",500))
}

 await Sales.findByIdAndUpdate(req.params.id,{
  cancel: true
 })

 if(find.type==0){
  sender = {
    _id: find.user._id,
    username: find.user.companyName,
    pictureProfile: find.user.profileCompany,
  };
  recipient = {
    _id: find.userTo._id,
    username: find.userTo.companyName,
    pictureProfile: find.userTo.profileCompany,
  };
} 
if(find.type==1){
  recipient = {
    _id: find.user._id,
    username: find.user.companyName,
    pictureProfile: find.user.profileCompany,
  };
  sender = {
    _id: find.userTo._id,
    username: find.userTo.companyName,
    pictureProfile: find.userTo.profileCompany,
  };
} 

  await cancelInquery((find.type==0)?find.user._id:find.userTo._id,find._id)
  
  await refreshGC();

  await pushNotification(recipient._id,16)

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.getFavoriteOrder=asyncHandler(async (req, res, next) => {
  const favoriteArray=[]
  const userId=req.user._id
  const result=await getFavoriteOrders(userId)
  console.log("resss",result);
  if(!result){
    return next(new ErrorResponse("server Error", 500));
  }
  if(result.length==0){
    return res.status(200).json({
      success:true,
      data:[]
    })
  }
  
  result.forEach(async(order)=>{
    console.log("orderrrrr",order);
    const find=await Sales.findById(order.orderId)
    console.log("ffffffffffff",find);
    favoriteArray.push(find)
  })

  console.log(favoriteArray);

  res.status(200).json({
    success:true,
    data:favoriteArray
  })
 })
 exports.getFavoriteOrderAdmin=asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you cant access this route",401))
  }
  const favoriteArray=[]
  const userId=req.params.id
  const result=await getFavoriteOrdersAdmin(userId)

  if(!result){
    return next(new ErrorResponse("server Error", 500));
  }
  if(result.length==0){
    return res.status(200).json({
      success:true,
      data:[]
    })
  }

  console.log(result);

  result.forEach(async(order)=>{
    console.log(order);
    const find=await Sales.findById(order.orderId)
    favoriteArray.push(find)
  })

  res.status(200).json({
    success:true,
    data:favoriteArray
  })
 })


 exports.newBid=asyncHandler(async (req, res, next) => {
  const {
    labReport,
    fineness,
    flashPoint,
    waterContent,
    address,
    phoneNumber,
    lineMaker,
  } = req.body;
  const allV=await getAllVarible()
  const bidamount=allV.commerceBidAmount*100
  
  let sender
  let recipient
  const sale=await Sales.findById(req.params.sale)
  if(!sale){
    return next(new ErrorResponse("Order not found !!",404))
  }
  const buissnesMan=await BussinessMan.findOne({
    "user._id":req.user._id
  })
  if(!buissnesMan){
    return next(new ErrorResponse("buisness Man not found !!",404))
  }

   
    
    if(sale.status!==1&&sale.status<4){//if order dont have any bid
       // //!wallet section
    const bidTransAction=await walletUpdater(0,req.user._id,bidamount,"commercebid","commerce")
    console.log("user",bidTransAction);
    if(!bidTransAction.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    const bidTransActionA=await walletUpdaterApp(1,req.user._id,bidamount,"commercebid","commerce")
    if(!bidTransActionA.success){
      return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
    }
    console.log("user",bidTransAction);
    console.log("app",bidTransActionA);
        const bid={
          bussId:buissnesMan._id ,
          userId:buissnesMan.user._id,
          paymnetInvoiceNumber:bidTransAction.data,
          bid:req.params.price ,
          status:"wating",
          at: Date.now(),
        }
        await Sales.findByIdAndUpdate(req.params.sale,{
          $addToSet: {bids:bid},
          bid:req.params.price,
          addressTo:address,
          status: 1,
          raisedPrice: req.params.price,
          userTo:buissnesMan.user,
        })
        sender = {
          _id: buissnesMan.user._id,
          username: buissnesMan.user.username,
          pictureProfile:buissnesMan.user.pictureProfile,
        };
        recipient = {
          _id: sale.user._id,
          username: sale.user.username,
          pictureProfile: sale.user.pictureProfile,
        };
        await pushNotificationStatic(recipient._id,1)
    }
    if(sale.status==1){
       if(sale.bid>req.params.price){// if bid lower than exist bid
        const bid={
          bussId:buissnesMan._id ,
          userId:buissnesMan.user._id ,
          bid:req.params.price ,
          status:"reject",
          at: Date.now(),
        }
        await Sales.findByIdAndUpdate(req.params.sale,{
          $addToSet : {bids:bid}
        })
        sender = {
          _id: buissnesMan.user._id,
          username: buissnesMan.user.username,
          pictureProfile:buissnesMan.user.pictureProfile,
        };
        await pushNotificationStatic(sender._id,3)

        
                
         return res.status(200).json({
          success:true,
          data:"you are rejected order have better bid "
         })
       }

      const rejectuser=sale.userTo

      await Sales.findOneAndUpdate(
        { _id: req.params.sale,
          bids:{
            $elemMatch :{status:"wating"}
          }
        },
        {
          $set: {
            "bids.$.status": "reject",
          },
        },
      );
     
         // //!wallet section
    const bidTransAction=await walletUpdater(0,req.user._id,bidamount,"commercebid","commerce")
    console.log("user",bidTransAction);
    if(!bidTransAction.success){
      return next(new ErrorResponse("Wallet transaction failed",500))
    }
    const bidTransActionA=await walletUpdaterApp(1,req.user._id,bidamount,"commercebid","commerce")
    if(!bidTransActionA.success){
      return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
    }
    console.log("user",bidTransAction);
    console.log("app",bidTransActionA);
      const bid={
        bussId:buissnesMan._id ,
        userId:buissnesMan.user._id ,
        bid:req.params.price ,
        paymnetInvoiceNumber:bidTransAction.data,
        status:"wating",
        at: Date.now(),
      }
      await Sales.findByIdAndUpdate(req.params.sale,{
        $addToSet:{bids:bid},
        bid:req.params.price,
        addressTo:address,
        raisedPrice: req.params.price,
        userTo:buissnesMan.user,
      })
      sender = {
        _id: buissnesMan.user._id,
        username: buissnesMan.user.username,
        pictureProfile:buissnesMan.user.pictureProfile,
      };
      recipient = {
        _id: sale.user._id,
        username: sale.user.username,
        pictureProfile: sale.user.pictureProfile,
      };
    
      const rejectUser = {
        _id: rejectuser._id,
        username: rejectuser.username,
        pictureProfile: rejectuser.pictureProfile,
      };
      await pushNotificationStatic(recipient._id,1)
      await pushNotificationStatic(rejectuser._id,3)
  
    }

  await refreshGC()

  res.status(200).json({
    success:true,
    data:{}
  })

 })
 exports.getQute=asyncHandler(async (req, res, next) => {
  const {}=req.body
 

  res.status(200).json({
    success:true,
    data:{}
  })
 })
  
 exports.notifPrice=asyncHandler(async (req, res, next) => {
  const {orderId,amount}=req.body
  console.log(orderId,amount);
  const sale=await Sales.findById(orderId)
  let reciver
  if(!sale){
    return next(new ErrorResponse("Sale Not Found"),404)
  }
  sender = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile:req.user.pictureProfile,
  };
  if(sale.type==0){
      reciver = {
        _id: sale.user._id,
        username: sale.user.username,
        pictureProfile: sale.user.pictureProfile,
      };
  }else{
      reciver = {
        _id: sale.userTo._id,
        username: sale.userTo.username,
        pictureProfile: sale.userTo.pictureProfile,
      };
  }
  await pushNotification(
    `${sender.username} Want just ${amount}`,
    ` Quantity Ask`,
    `${sender.username} Want just ${amount}`,
    reciver,
    sender,
    "commerceStack",
    "Order"
  );
  res.status(200).json({success:true})
})


exports.inspectorPending=asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you cant access this route",401))
  }
  
  const pending=await Sales.find({
    $and:[{
      inspectorRequire:true,

    },{
      inspectorStatus:1
    }]
  })

  res.status(200).json({
    success:true,
    data:{pending}
  })
 })

 exports.inspectorApprove=asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you cant access this route",401))
  }
  
  const approve=await Sales.findByIdAndUpdate(req.params.id,{
    inspectorStatus:2
  })
  if (approve.haveTransport) {

    await transportInspection(req.params.id,"approve")

    await refreshGT()
  }  


  await pushNotification(approve.user._id,15)
  await pushNotification(approve.userTo._id,15)
  await refreshGC();

  res.status(200).json({
    success:true,
    data:{approve}
  })
 })

 exports.inspectorReject=asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you cant access this route",401))
  }
  const reject=await Sales.findByIdAndUpdate(req.params.id,{
    inspectorStatus:3
  })

  
  if (reject.haveTransport) {

    await transportInspection(req.params.id,"reject")

    await refreshGT()
  }
  

  await refreshGC();
  await pushNotification(reject.user._id,14)
  await pushNotification(reject.userTo._id,14)

  res.status(200).json({
    success:true,
    data:{reject}
  })
 })

 exports.inspectorRequest=asyncHandler(async (req, res, next) => {
  const {id,price}=req.body

  const invoiceNumber=await walletUpdater (0,req.user._id,price*100,"inspector Request")
  if(!invoiceNumber.success){
    return next(new ErrorResponse("wallet paymnet fail",500))
  }
  const appInvoiceNumber=await walletUpdaterApp(1,req.user._id,price*100,"inspector Request")
  if(!appInvoiceNumber.success){
    return next(new ErrorResponse("wallet paymnet fail",500))
  }
  const find=await Sales.findByIdAndUpdate(id,{
    inspectorRequire:true,
    inspectorStatus:1,
    inspectorPrice:price,
    inspectorPaymnetInvoiceNumber:invoiceNumber.data
  })
  

 
  if (find.haveTransport) {
    await transportInspection(id,"init")
    await refreshGT()
  }
  
  await pushNotificationStatic(find.user._id,13)

  await refreshGC();

  res.status(200).json({
    success:true,
    data:{find}
  })
 })
 exports.raisPrice=asyncHandler(async (req, res, next) => {
  const order=await Sales.findById(req.params.id)
  const type=req.params.type
  if(!order||!order.autoPrice||order.status==1){
   return next(new ErrorResponse("some thing went wrong please check your inputs value",400))
  }
  console.log("okkkkk",order.status);
  
  const difPriceCreate = (order.maxPrice - order.price) / 2;
  const difPrice = Math.abs(difPriceCreate);
  if(type==1){
   let raisedPrice
   const perPrice = (Math.abs(difPrice) * 60) / 100;
   (order.type==0)?raisedPrice=order.price+perPrice:raisedPrice=order.price-perPrice     
   order.raisedPrice=raisedPrice
   order.lastPrice=raisedPrice
   order.status=2
   await order.save()
  }
  if(type==2){
    const perPrice=(Math.abs(difPrice) * 80) / 100;
    (order.type==0)?raisedPrice=order.price+perPrice:raisedPrice=order.price-perPrice
    order.raisedPrice=raisedPrice
    order.lastPrice=raisedPrice
    order.status=3
    await order.save()
  }
  await refreshGC()
  res.status(200).json({
   success:true,
  })
 })

 exports.endTimeHandeler=asyncHandler(async (req, res, next) => {
      const order=await Sales.findById(req.params.id)
      
      if(!order){
      return next(new ErrorResponse("some thing went wrong please check your inputs value",400))
      }

      if(order.status<4&&order.status!=1&&order.cancel==false){
          order.end=true
          await order.save()
          // await cancelInquery(req.params.id)
      }
      if(order.status==1&&order.cancel==false){
        const sales = await Sales.findById(req.params.id);
        let userIdFind;
        sales.bids.find((item) => {
          if (item.bid == sales.bid) {
            userIdFind = item.userId;
          }
        });
      
        const buss = await BussinessMan.findOne({
          "user._id": userIdFind,
        });
      
      
        const obj = {
          _id: buss.user._id,
          idCompany: buss._id,
          profileCompany: buss.profileCompany,
          companyName: buss.companyName,
          phone: buss.user.phone,
        };
      
        const time = {
          status: 4,
          action: 0,
          at: Date.now(),
        };
        const findTrans = await findTransport(req.params.id, req.user._id);
        if (findTrans.success) {

    
          const cond=(sales.type==0)?sales.user._id:sales.userTo._id
      
          console.log(cond);
      
         const changeStatusresult= await changeStatus(cond,req.params.id)
      
         const cancelOtherShiing=await cancelInqueryOtherTransport((sales.type==1)?sales.user._id:sales.userTo._id)
          
          console.log("changeStatusresult",changeStatusresult.success);
      
          await Sales.findOneAndUpdate(
            {
              _id: req.params.id,
              "bids.bussId": buss._id,
            },
            {
              $set: {
                "bids.$.status": "accept",
              },
              $addToSet: { statusTime: time },
              status: 4,
              userTo: sales.type == 0 ? obj : sales.userTo,
              user: sales.type == 0 ? sales.user : obj,
              transportCompany: findTrans.data.transport,
              raisedPrice: sales.bid,
              transportStatus:4,
              haveTransport:true
            }
          );
        } else {
          
          await Sales.findOneAndUpdate(
            {
              _id: req.params.id,
              "bids.bussId": buss._id,
            },
            {
              $set: {
                "bids.$.status": "accept",
              },
              $addToSet: { statusTime: time },
              status: 4,
              userTo: sales.type == 0 ? obj : sales.userTo,
              user: sales.type == 0 ? sales.user : obj,
              raisedPrice: sales.bid,
            }
          );
        }
      
        const sender = {
          _id: sales.user._id,
          username: sales.user.companyName,
          pictureProfile: sales.user.profileCompany,
        };
      
        const recipient = {
          _id: sales.userTo._id,
          username: sales.userTo.companyName,
          pictureProfile: sales.userTo.profileCompany,
        };
      
        
      
        if (sales.type == 0) {
          await pushNotification(
            "Accept bid",
            "Your bid accepted and you must pay deposite in app",
            `${sender.username} accept your bid`,
            recipient,
            sender,
            "commerceStack",
            "Order"
          );
          await notification(
            "change status",
            sender,
            recipient,
            sales._id,
            "Order",
            "change status sales",
            "change status commerce"
          );
        } else {
          await pushNotification(
            "Accept bid",
            "Your bid accepted and you must pay deposite in app",
            `${sender.username} accept your bid`,
            recipient,
            sender,
            "commerceStack",
            "Order"
          );
          await notification(
            "change status",
            recipient,
            sender,
            sales._id,
            "Order",
            "change status sales",
            "change status commerce"
          );
        }
      
      }
      console.log("raisesworked .......");
      await refreshGC()
      res.status(200).json({
       success:true,
      })
 })

 exports.cancelBidOffer=asyncHandler(async (req, res, next) => {
  const sale=await Sales.findById(req.params.id)
  console.log(req.user);
  let recipient
  if(sale.type==0)
  {
    recipient = {
     _id: sale.user._id,
     username: sale.user.companyName,
     pictureProfile: sale.user.profileCompany,
   };
    const bidsArray=sale.bids

    const withOutCancel=bidsArray.filter(item=>{
      return item.userId!=req.user._id
    })

    //! comment penalty

    
    if(withOutCancel.length==0){
      sale.bids=withOutCancel
      sale.bid=0
      sale.raisedPrice=sale.price
      sale.status=0
      sale.userTo={}
      await sale.save()
    }else{
      let max=0
      withOutCancel.forEach(item=>{
        if(item.bid>0){
          max=item.bid
        }
      })

      console.log(max);

      const findIndex=withOutCancel.findIndex(item=>item.bid==max)
      withOutCancel[findIndex].status="wating"
      sale.bids=withOutCancel
      sale.bid=max
      sale.raisedPrice=max
      sale.userTo._id=withOutCancel[findIndex].userId
      await sale.save() 

    }
  }else{
    console.log("buy");
    recipient = {
      _id: sale.userTo._id,
      username: sale.userTo.companyName,
      pictureProfile: sale.userTo.profileCompany,
    };
     const bidsArray=sale.bids
 
     const withOutCancel=bidsArray.filter(item=>{
       return item.userId!=req.user._id
     })
     console.log("llllllllllll",withOutCancel);
     if(withOutCancel.length==0){
      
      sale.bids=withOutCancel
      sale.bid=0
      sale.status=0
      sale.raisedPrice=sale.price
      sale.user={}
      await sale.save()
     }else{

      let min=withOutCancel[0].bid
      withOutCancel.forEach(item=>{
        if(item.bid<min){
          min=item.bid
        }
      })
      console.log("mmm",min);
      const findIndex=withOutCancel.findIndex(item=>item.bid==min)
      console.log(findIndex);
      withOutCancel[findIndex].status="wating"
      sale.bids=withOutCancel
      sale.bid=min
      sale.raisedPrice=min
      sale.user._id=withOutCancel[findIndex].userId
      await sale.save()
      await refreshGC()
      res.status(201).json({success:true,data:sale})
     }
  }
  await pushNotificationStatic(recipient._id,17)  
  await refreshGC()
  res.status(200).json({
    success:true,
    data:{}
  })
 })

 exports.raisPriceManualy=asyncHandler(async (req, res, next) => {
  const sale=await Sales.findById(req.params.id)
  console.log(sale);
  const buissnesMan=await BussinessMan.findOne({"user._id":req.user._id})
  const newPrice=req.params.price

  if(!sale||!buissnesMan){
    return next(new ErrorResponse("Resourse not found"),404)
  }
  if(sale.status!=0){
    return next(new ErrorResponse("Bad request"),400)
  }
  
   
  
  sale.price=newPrice
  sale.raisPrice=newPrice
  sale.lastPrice=newPrice
  await sale.save()

  
  await refreshGC()

  res.status(201).json({success:true,data:sale})
 })