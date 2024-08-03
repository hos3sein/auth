const crypto = require("crypto");
const fs = require("fs");

const encrypt = async (json) => {
  const key3DES = "NMjMehmjXrEKcBaoyT19wJAT";
  const JsonToString = await JSON.stringify(json);
  //   key3DES = md5(key3DES);
  //   console.log(key3DES.toString("base64"));
  //   key3DES = Buffer.concat([key3DES, key3DES.slice(0, 8)]); // properly expand 3DES key from 128 bit to 192 bit
  const cipher = crypto.createCipheriv("des-ede3", key3DES, "");
  const encrypted = cipher.update(JsonToString, "utf8", "base64");
  // return console.log("encrypted", encrypted + cipher.final("base64"));
  return encrypted + cipher.final("base64");
};

// exports.module = encrypt;
module.exports = encrypt;
