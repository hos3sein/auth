const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");

const SalesSchema = new mongoose.Schema(
  {
    seller: {
      _id: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
    },

    productType: {
      type: Number,
    },
    productName: {
      type: String,
    },
    fineness: {
      type: Number,
    },
    lossOfLgnition: {
      type: Number,
    },

    waterdemandRatio: {
      type: Number,
    },
    price: {
      type: Number,
    },
    smallSamplePrice: {
      type: Number,
    },
    largeSamplePrice: {
      type: Number,
    },
    quantity: {
      type: Number,
    },

    fixedQuantity: {
      type: Boolean,
      default: false,
    },

    lineMaker: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
    },

    labReport: [String],

    address: {
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

    grade: {
      type: Number,
    },
    buyers: [mongoose.Schema.ObjectId],

    invoiceNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

SalesSchema.pre("save", async function (next) {
  const uid = await new ShortUniqueId({ length: 8 });

  this.invoiceNumber = await uid();
});
module.exports = mongoose.model("Sales", SalesSchema);
