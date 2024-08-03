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
    userTo: {
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

    finenessOrginal: {
      type: Number,
    },

    flashPointOrginal: {
      type: Number,
    },

    waterContentOrginal: {
      type: Number,
    },

    origin: {
      type: String,
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

    addressTo: {
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

    transportCompany: {
      userId: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
      bid: { type: Number },
      address: { type: String },
    },

    phoneNumber: {
      type: String,
    },

    phoneNumberTo: {
      type: String,
    },

    lineMaker: {
      type: Boolean,
    },

    lineMakerTo: {
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

    lastPrice: { type: Number },

    price: { type: Number },

    raisedPrice: { type: Number },

    maxPrice: { type: Number },

    autoPrice: { type: Boolean, default: false },

    bid: { type: Number, default: 0 },

    note: { type: String },

    bids: [
      {
        bussId: mongoose.Schema.ObjectId,
        userId: mongoose.Schema.ObjectId,
        paymnetInvoiceNumber:String,
        bid: Number,
        status: String,
        at: String,
        _id: false,
      },
    ],

    statusTime: [
      {
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        action: Number,
        status: Number,
        at: String,
        _id: false,
      },
    ],

    buyers: {
      type: mongoose.Schema.ObjectId,
      ref: "Buy",
    },

    message: [
      {
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        at: String,
        _id: false,
      },
    ],
    // 0 == Init
    // 1 == pishnahad shode
    // 2 == raise one
    // 3 == raise two
    // 4 == Booked
    // 5 == Picked Up
    // 6 == Deliverd
    // 10 == be kasi neshon nemide
    status: {
      type: Number,
    },

    // ! in baraye khodame baraye resubmit kardan
    pending: {
      type: Boolean,
      default: true,
    },

    transportMethod: {
      truck: { type: Boolean, default: false },
      ship: { type: Boolean, default: false },
      rail: { type: Boolean, default: false },
    },

    end: {
      type: Boolean,
      default: false,
    },
    
    transportStatus:{
      type: Number,
    },
    
    cancel: {
      type: Boolean,
      default: false,
    },
    
    haveTransport: {
      type: Boolean,
      default: false,
    },

    transportPrice:{
      type: Number,
      default:0
    },

    // 0 == seller
    // 1 == buyer
    type: {
      type: Number,
    },

    invoiceNumber: {
      type: String,
    },
    userFavorites: [{ userId: mongoose.Schema.ObjectId, _id: false }],
    inspectorRequire:{
      type:Boolean,
      default:false
    },
    inspectorStatus:{ //? 0=pending  1=Approve  2=reject
       type:Number,
       default:0
    },

    inspectorPrice:{
      type:Number,
      default:0
    },
    inspectorPaymnetInvoiceNumber:{
      type:String,    
    },
    buyerDepositeInvoiceNumber:{
      type:String,
    },
    sellerrDepositeInvoiceNumber:{
      type:String,
    }

  },
  { timestamps: true }
);

SalesSchema.pre("save", async function (next) {
  const uid = await new ShortUniqueId({ length: 8 });

  this.invoiceNumber = await uid();
});
module.exports = mongoose.model("Sales", SalesSchema);
