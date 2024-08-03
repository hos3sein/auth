const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");

const BuySchema = new mongoose.Schema(
  {
    sales: {
      type: mongoose.Schema.ObjectId,
      ref: "Sales",
    },

    buyer: {
      _id: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
    },

    seller: {
      _id: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
    },

    origin: {
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

    destination: {
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

    phoneNumber: {
      type: String,
    },

    transportCompany: {
      userId: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
    },

    // selling
    labReport: [String],

    // selling
    dateFrom: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    // selling
    dateTo: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    // selling
    shipmentAmount: {
      type: Number,
    },

    // selling
    lineMaker: {
      type: Boolean,
    },

    // selling
    fineness: {
      type: Number,
    },

    // selling
    flashPoint: {
      type: Number,
    },

    // selling
    waterContent: {
      type: Number,
    },

    priceTransportCompany: {
      type: Number,
    },

    price: {
      type: Number,
    },

    raisedPrice: { type: Number, default: 0 },

    maxPrice: { type: Number },

    autoPrice: { type: Boolean, default: false },

    quantity: {
      type: Number,
    },

    // // 0 == Sales
    // // 1 == small sample
    // // 2 == large sample
    // buyType: {
    //   type: Number,
    // },

    // 0 == for seller
    // 1 == for buyer
    type: {
      type: Number,
    },

    // buyType == 0 &&
    // 0 == pennding
    // 1 == transporting
    // 2 == picked up
    // 3 == delivered

    // buyType == 1 & 2 &&
    // 0 == pennding
    // 1 == send
    // 2 == delivered

    status: {
      type: Number,
    },

    salse: {
      type: mongoose.Schema.ObjectId,
      ref: "Sales",
    },

    // id bashe
    // ba etelate seller
    // feild ke chi dare mikhare
    // status
    // quintuty

    invoiceNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

BuySchema.pre("save", async function (next) {
  const uid = await new ShortUniqueId({ length: 8 });

  this.invoiceNumber = await uid();
});
module.exports = mongoose.model("Buy", BuySchema);
