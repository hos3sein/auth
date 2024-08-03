const fs = require("fs");
const crypto = require("crypto");

const publicKey = Buffer.from(
  fs.readFileSync("public.pem", { encoding: "utf-8" })
);

const privateKey = fs.readFileSync("private.pem", { encoding: "utf-8" });

const signature = async (encrypted) => {
  const signatureCheck = crypto.sign("sha256", Buffer.from(encrypted), {
    key: privateKey,
  });
  //   console.log("signatureCheck", signatureCheck);
  const isVerified = crypto.verify(
    "sha256",
    Buffer.from(encrypted),
    {
      key: publicKey,
    },
    signatureCheck
  );
  //   console.log("isVerified", isVerified);
  if (isVerified) {
    return signatureCheck.toString("base64");
  }
};

module.exports = signature;
