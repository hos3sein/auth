const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { type } = require("os");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    fullName: {
      type: String,
    },

    phone: {
      type: String,
    },

    role: {
      type: Number,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    pictureProfile: {
      type: String,
      default: "",
    },

    documents: [String],

    code: {
      type: Number,
    },

    codeUsed: {
      type: Boolean,
      default: false,
    },

    codePass: {
      type: Number,
    },

    codePassTime: {
      type: String,
    },

    codeUsedPass: {
      type: Boolean,
      default: false,
    },

    pointResons:[
      {
        resons: { type: String },
        point:{type:Number},
        content:{type:mongoose.Schema.ObjectId},
        comment:{type:mongoose.Schema.ObjectId},
        _id: false,
      }
    ],
    points:{
      type:Number,
      default:0
    },
    
    favoriteLocations: [
      {
        address: { type: String },
        nameAddress: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        target: { type: Number },
        city: { type: String },
        province: { type: String },
        district: { type: String },
        street: { type: String },
        country: { type: String },
        streetNumber: { type: String },
        _id: false,
      },
    ],

    group: [String],
    
    adminRole : [{name : {type : String} , id : {type : String}}],

    pending: [mongoose.Schema.ObjectId],

    isActive: {
      type: Boolean,
      default: false,
    },

    complete: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    
    interducer:{
      type:mongoose.Schema.ObjectId,ref:"User"
    },
    deviceToken: [String],

    ipAddress: {
      type: String,
    },

    osPhone: {
      type: String,
    },

    brandPhone: {
      type: String,
    },

    modelPhone: {
      type: String,
    },

    devices: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: String,
    },
 
    isVip:{
      type:Boolean,
      default:false
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    accessArray:[
      {
        page:{type:String},
        number:{type:String},
        _id: false,
      }
    ],
    totalInvitedUser:{
      type:Number,
      default:0
    },
    walletAmount:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sam
// UserSchema.pre("findOneAndUpdate", async function () {
//   console.log("this.password", this.password);
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log("docToUpdate", docToUpdate);
//   await docToUpdate.updateOne({ $set: { password: "test" } });
// });

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!_.isEmpty(update.password)) {
    const salt = await bcrypt.genSalt(10);
    this.getUpdate().password = await bcrypt.hash(update.password, salt);

    next();
  } else {
    next();
  }
});

// // Encrypt password using bcrypt
// UserSchema.post("findOneAndUpdate", async function (result) {
//   console.log("result", result);

//   console.log("result", result.password);
//   const salt = await bcrypt.genSalt(10);
//   result.password = await bcrypt.hash(result.password, salt);
// });

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isActive: this.isActive,
      phone: this.phone,
      email: this.email,
      username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
      fullName: this.fullName,
      pictureProfile: this.pictureProfile,
      documents: this.documents,
      complete: this.complete,
      group: this.group,
      points:this.points,
      totalInvitedUser:this.totalInvitedUser

    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);