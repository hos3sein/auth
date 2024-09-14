const encrypt = require("./encrypt");
const signature = require("./signature");
const fetch = require("node-fetch");
const moment = require("moment");

exports.request = async () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(";

  function generateString(length) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  const sal = moment().format("YYYY");

  const mah = moment().format("MM");
  const roz = moment().format("DD");
  const random = Math.floor(10000 + Math.random() * 9000000000000);
  const serialN = `${sal}${mah}${roz}${random}`;

  const time = moment().format("HHmmss");

  const expire = moment().add(2, "years").format("YYYYMMDD");

  // HH24MISS
  // return;
  // let sampleJson = {
  //   acctountName: "阿米尔",
  //   certType: "A",
  //   // Todo id card number
  //   certNo: "486939683958395938",
  //   expirationDate: expire,
  //   forever_flag: "0",
  //   operateMobile: "13081988087",
  //   // ! nemidonam
  //   acctBank: "3495639872908",
  //   accountNo: "39463958693873",
  //   accountName: "阿米尔",
  //   firmId: generateString(40),
  //   // 男 == mard  女 ==zan
  //   gender: "男",
  //   // We send these numbers to the bank 40200 and 29900 and 10600
  //   occupation: "40200",
  //   nationality: "CHN",
  //   sign_date: `${sal}${mah}${roz}`,
  //   // ! address of id card
  //   issuing_authority:
  //     "浙江省宁波市鄞州区百丈街道中山东路294号宁波新世界广场(建设中)",
  //   // ! false

  //   // province: "",
  //   // ! false

  //   // city: "",
  //   // !We send number 2 or 3 to the bank (the level of the city )
  //   areaCode: "2",

  //   // ! home address
  //   address: "浙江省宁波市鄞州区百丈街道中山东路294号宁波新世界广场(建设中)",
  //   // !اطلاعات سفارشی ارسال شده توسط شرکا
  //   // ! false
  //   // customization_info: "",
  //   // ! Normal : 一般用户（默认值）; Repay_10 : 个人借款人（还贷通业务模式下需填写）
  //   // !Send normal
  //   virAcctType: "294842",
  //   // ! false
  //   // thirdPartyInfo: "",
  //   // ! false
  //   // nation: "",

  //   tax_resident: "1",

  //   // !false
  //   // occupation_desc: "",
  //   // !false
  //   // cust_companyName: "",
  //   // firmid: "yanshifirmid",
  //   // virAcctNo: "yanshivirAcctNo",
  //   // virAcctName: "yanshivirAcctName",
  //   // dealBusModel: "O",
  //   // accountNo: "001002003006",
  //   // transferAmount: "100",
  //   // outPlatCharge: "0",
  //   // moneyKind: "CNY",
  //   // tradeRef: "演示用例",
  // };
  let sampleJson = {
    acctountName: "阿米尔",
    certType: "A",
    certNo: "486939683958395938",
    expirationDate: expire,
    forever_flag: "0",
    operateMobile: "13081988087",
    acctBank: "3495639872908",
    accountNo: "39463958693873",
    accountName: "阿米尔",
    firmId: generateString(40),
    gender: "男",
    occupation: "40200",
    nationality: "CHN",
    sign_date: `${sal}${mah}${roz}`,
    issuing_authority:
      "浙江省宁波市鄞州区百丈街道中山东路294号宁波新世界广场(建设中)",

    areaCode: "2",

    address: "浙江省宁波市鄞州区百丈街道中山东路294号宁波新世界广场(建设中)",

    virAcctType: "294842",

    tax_resident: "1",
  };
  const encrypted = await encrypt(sampleJson);

  if (encrypted) {
    const sign = await signature(encrypted);
    // return console.log("sal", sign);
    let reqData = {
      msgVerNo: "V3.0",
      requestSerialNo: serialN,
      tradeCode: "12101",
      tradeDate: `${sal}${mah}${roz}`,
      tradeTime: time,
      requestServiceNo: "121.41.58.117:8111",
      channelID: "13315008",
      signatureMsg: sign,
      data: encrypted,
    };
    try {
      fetch(
        "http://203.156.238.218:18080/api/Common/VirAcct/V3/PersonOpenVirAcct",
        {
          method: "POST",
          body: JSON.stringify(reqData),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log("eerr", err);
    }
  }
};

exports.getInfoForChartCommerce = async () => {

  const url = `${process.env.SERVICE_ECOMMERCE}/api/v1/commerce/interservice/getinfoforchart`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.getInfoForChartTruck = async () => {
  const url = `${process.env.SERVICE_TRUCK}/api/v1/truck/interservice/getinfochart`;
  // const url = `http://localhost:8008/api/v1/truck/interservice/getinfochart`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.getInfoForChartTransport = async () => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/getinfoforchart`;
  // const url = `http://localhost:8011/api/v1/transport/interservice/getinfoforchart`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.getPointAmount = async () => {
  const url = `${process.env.SERVICE_SETTING}/api/v1/setting/point/all`;
  // const url = `http://localhost:8000/api/v1/setting/point/all`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return {points:response.data,success:response.success};
    } else {
      return {points:{},success:response.success};;
    }
  } catch (err) {
    console.log("err", err);
  }
};


exports.smsCheck=async (phone,code) => {

  const url = `http://185.110.189.251:8002/api/v1/auth/smscheck`;

  console.log(phone,code);
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        phone,
        code
      })
    });
    const response = await rawResponse.json();
    if (response.success) {
      console.log(response);
      return response;
    } else {
      console.log(response);
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.createWallet=async (userId,username,pictureProfile) => {
console.log("here");
  const url = `${process.env.SERVICE_PAYMNET}/api/v1/payment/wallet/create`;
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        userId,
        username,
        pictureProfile
      })
    });
    const response = await rawResponse.json();
    console.log(response);
    if (response.success) {
      console.log("nice");
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("err", err);
  }
};







exports.newLog=async (body) => {
console.log("here");
  const url = `${process.env.SERVICE_SETTING}/api/v1/setting/log/putlog`;
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body:JSON.stringify(body)
    });
    const response = await rawResponse.json();
    console.log(response);
    if (response.success) {
      console.log("nice");
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("err", err);
  }
};

