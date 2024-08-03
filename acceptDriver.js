const Sales = require("./models/Sales");
const BussinessMan = require("./models/BussinessMan");

const { refresh, refreshGC, refreshGT } = require("./utils/refresh");
const {deleteInquery}=require("./utils/request")
const moment = require("moment");

const check = async () => {
  // console.log("accept");

  const allSales = await Sales.find();

  for (let i = 0; i < allSales.length; i++) {
    const element = allSales[i];

    const closeTime = moment(`${element.createdAt}`)
      .add(`${element.closingDate}`, "hour")
      .format("YYYY/MM/DD HH:mm");

    const alan = moment();

    const currentDate = moment(closeTime);

    // ! in 0 she bayad driver accept she
    const now2 = currentDate.diff(alan, "minutes");

    if (
      !element.end &&
      (element.status == 0 || element.status == 2 || element.status == 3) &&
      !element.bids.length &&
      now2 <= 0
    ) {
      // console.log("now2>>>>>>>>>>>>>>>>>>>>>", now2);
      await Sales.findByIdAndUpdate(
        element._id,
        {
          end: true,
        },
        { strict: false }
      );
      await deleteInquery(element._id)
      await refreshGC();

       
      // console.log("111111111");
    }

    if (element.status == 1 && element.bids.length && now2 <= 0) {
      // console.log("222222");
      
      if(element.type==0){
        let userIdFind;
        element.bids.find((item) => {
          if (item.bid == element.bid) {
            userIdFind = item.userId;
          }
        });
        console.log(userIdFind);
  
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
  
        await Sales.findOneAndUpdate(
          {
            _id: element._id,
            "bids.bussId": buss._id,
          },
          {
            $set: {
              "bids.$.status": "accept",
            },
            $addToSet: { statusTime: time },
            userTo: obj,
            status: 4,
            raisedPrice: element.bid,
          }
        );

      }
      if(element.type==1){
        let userIdFind;
        element.bids.find((item) => {
          if (item.bid == element.bid) {
            userIdFind = item.userId;
          }
        });
        console.log(userIdFind);
  
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
  
        await Sales.findOneAndUpdate(
          {
            _id: element._id,
            "bids.bussId": buss._id,
          },
          {
            $set: {
              "bids.$.status": "accept",
            },
            $addToSet: { statusTime: time },
            user: obj,
            status: 4,
            raisedPrice: element.bid,
          }
        );
      }

     
      
      refreshGC();
    }
  }
};

exports.acceptDriver = (interval) => {
  setInterval(async () => {
    await check();
  }, interval);
};
