const mongoose = require("mongoose");

const adminGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
    },

    number: {
      type: String,
    },

    accessArray:[
        {
          page:{type:String},
          number:{type:String},
          _id: false,
        }
    ],

    members : [{
        id : {type : mongoose.Schema.ObjectId},
        username : {type : String},
        pictureProfile : {type : String}
    }],
    isActive : {type : Boolean , default : true}
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("adminGroup", adminGroupSchema);
