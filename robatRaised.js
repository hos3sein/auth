const Sales = require("./models/Sales");
const { refresh, refreshGC, refreshGT } = require("./utils/refresh");
const { addRefresh } = require("./utils/request");

const moment = require("moment");

const check = async () => {
  

  const allSales = await Sales.find({
    $and: [
      { autoPrice: true },
      {cancel:false},
      {end:false},
      // { "buyers.length": 0 },
      { $or: [{ status: 0 }, { status: 2 }, { status: 3 }] },
    ],
  });

  for (let i = 0; i < allSales.length; i++) {
    const element = allSales[i];

    if (element.bids.length == 0) {
      const closeTime = moment(`${element.createdAt}`)
        .add(`${element.closingDate}`, "hour")
        .format("YYYY/MM/DD HH:mm");

      const createTime = moment(`${element.createdAt}`).format(
        "YYYY/MM/DD HH:mm"
      );

      const currentDate = moment(closeTime);
      const returnDate = moment(createTime);

      const alan = moment();

      const diff = currentDate.diff(returnDate, "minutes");
      // console.log("diff", diff);

      const now = alan.diff(returnDate, "minutes");

      const res = (diff * 60) / 100;
      const res2 = (diff * 80) / 100;

      const difPriceCreate = (element.maxPrice - element.price) / 2;

      const difPrice = Math.abs(difPriceCreate);
      // console.log("res", now);
      // console.log("res", res1);

      // console.log("res", res2);

      const perPrice = (Math.abs(difPrice) * 60) / 100;
      const perPrice2 = (Math.abs(difPrice) * 80) / 100;

      if (now >= res && now <= res2 && element.status == 0) {
        // console.log(">>>>>>11111");
        await Sales.findByIdAndUpdate(
          element._id,
          {
            raisedPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,
            lastPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,
            status: 2,
          },
          { strict: false }
        );

        
        refreshGC();
      }

      if (now >= res2 && now <= diff && element.status == 2) {
        // console.log(">>>2222");

        await Sales.findByIdAndUpdate(
          element._id,
          {
            raisedPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,
            lastPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,

            status: 3,
          },
          { strict: false }
        );

        // await addRefresh(
        //   element.type == 0 ? element.user._id : element.userTo._id,
        //   "refreshCommerce"
        // );

        // await refresh(
        //   element.type == 0 ? element.user._id : element.userTo._id,
        //   "refreshCommerce"
        // );

        refreshGC();
      }

      // console.log(difPrice);
    }
  }

  //   $and: [{ autoPrice: true }],
  // { $or: [{ status: 0 }, { status: 2 }, { status: 3 }] },
  // { "buyers.length": 0 },
};

// check();

exports.robatRaised = async (interval) => {
  setInterval(async () => {
    await check();
  }, interval);
};
