const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");

const SalesSchema = new mongoose.Schema(
  {
    user: {
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

    labReport: [String],

    grade: {
      type: Number,
    },

    quantity: {
      type: Number,
    },

    fineness: {
      type: Number,
    },

    flashPoint: {
      type: Number,
    },

    waterContent: {
      type: Number,
    },

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
    },

    phoneNumber: {
      type: String,
    },

    lineMaker: {
      type: Boolean,
    },

    dateFrom: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    dateTo: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    shipmentAmount: {
      type: Number,
    },

    closingDate: {
      type: Number,
    },

    price: { type: Number },

    maxPrice: { type: Number },

    autoPrice: { type: Boolean, default: false },

    note: { type: String },

    buyers: [mongoose.Schema.ObjectId],

    status: {
      type: Number,
    },

    transportMethod: {
      truck: { type: Boolean, default: false },
      ship: { type: Boolean, default: false },
      rail: { type: Boolean, default: false },
    },

    // 0 == seller
    // 1 == buyer
    type: {
      type: Number,
    },

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
