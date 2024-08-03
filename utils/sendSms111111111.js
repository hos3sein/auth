// const request = require("request");
// const fetch = require("node-fetch");

// const sendSms = async (phone, code) => {
//   try {
//     const formData = {
//       account: "SMS_YQKJ",
//       password: "52cf186258738f79e4e6481a1a4f6829",
//       mobile: `${phone}`,
//       content: `【宁波哥伦布】您的验证码是${code}。`,
//       sender: "GLBNET",
//     };
//     request.post(
//       {
//         url: "http://101.37.254.178:9001/sms/service/postSend",
//         form: formData,
//       },
//       (err, httpResponse, body) => {
//         console.log(">>>>>>>>>>>>>>>>>>>>>>>errrrrrr", err);
//         console.log("body>>>>>>>>>>>>>>>>>>>>>>>>>", body);
//         console.log(
//           ">>>>>>>>>>>>>>>>>>>>>>>httpResponse>>>>>>>>>>>>>>>>>",
//           httpResponse
//         );
//       }
//     );

//     console.log("formData>>>>>>>>>>>>>>");
//   } catch (err) {
//     console.log("err>>>", err);
//   }
// };

// module.exports = sendSms;
