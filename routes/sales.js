const express = require("express");

const C = require("../controllers/sales");

const { protect } = require("../middleware/auth");

const router = express.Router();

// POST
router.post("/createsales", protect, C.createSales);
router.post("/update/:id", protect, C.update);
router.post("/buy/:sales", protect, C.buy);

// router.post("/bidprice/:sales/:price", protect, C.bid);
router.post("/bidpriceseller/:sale/:price", protect, C.newBid);
router.post("/bidprice/:sale/:price", protect, C.newBid);
router.post("/msg/:id", protect, C.msg);
router.post("/msgimage/:id", protect, C.newMsgImage);

router.post("/createlinemaker", protect, C.createLineMaker);

router.post("/getqute",protect,C.getQute)

router.post("/notifquantity",protect,C.notifPrice)

// GET
router.get("/changestatus/:id/:status", protect, C.changeStatus);
router.get("/changestatussales/:id", protect, C.changeStatusSales);

router.get("/allsalesme", protect, C.allSalesMe);
router.get("/allsales", protect, C.allSales);

router.get("/allsaleswt", C.allSalesWithToken);
router.get("/buyme", protect, C.buyMe);
router.get("/sellme", protect, C.sellMe);

router.get("/approve/:id", protect, C.approveBuyer);

router.get("/cancelorderme/:id", protect, C.cancelSalesMe);
router.get("/cancelorder/:id", protect, C.cancelOredr);

router.get("/getfavoriteordercommerce",protect,C.getFavoriteOrder)
router.get("/getfavoriteordercommerceadmin/:id",protect,C.getFavoriteOrderAdmin)

//! inpector routes

router.post("/inspectorRequest", protect, C.inspectorRequest);

router.get("/getinspectorpending",protect,C.inspectorPending)
router.get("/approveinspector/:id",protect,C.inspectorApprove)
router.get("/rejectinspector/:id",protect,C.inspectorReject)


router.get("/raisprice/:id/:type",protect,C.raisPrice)

router.get("/endhandeler/:id",protect,C.endTimeHandeler)

router.get("/cancelbid/:id",protect,C.cancelBidOffer)

router.get("/updateprice/:id/:price",protect,C.raisPriceManualy)

// router.get("/getinspectorpending",C.inspectorPending)
// router.get("/approveinspector/:id",C.inspectorApprove)
// router.get("/rejectinspector/:id",C.inspectorReject)



module.exports = router;
