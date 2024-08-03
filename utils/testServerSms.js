const request = require("request");
const fetch = require("node-fetch");

const sendSmsTest = async (phone, code) => {
  try {
    const url = `http://185.110.189.251:8002/api/v1/auth/dev/sms/${phone}/${code}`;

    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    return response
    
  } catch (err) {
    console.log("err>>>", err);
  }
};

module.exports = sendSmsTest;
