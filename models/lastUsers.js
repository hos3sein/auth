const mongoose = require("mongoose");

const lastUserCount = new mongoose.Schema(
  {
    name : {type : String , default :'userCounter'},
    Truck : {type : Number},
    transport : {type : Number},
    commerce : {type : Number},
    linemaker : {type : Number},
    USER : {type : Number}
  },
  { timestamps: true }
);

module.exports = mongoose.model("lastUser", lastUserCount);
