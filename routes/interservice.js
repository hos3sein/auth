const express = require("express");

const C = require("../controllers/interservice");

const router = express.Router();

// POST
router.post("/createuserlineMaker", C.createUserLineMaker);

// router.post("/createbuy", C.createBuy);

router.get("/getdevicetoken/:id", C.getDeviceToken);

router.get("/setvip/:id",C.setVip)

router.get("/unsetvip/:id",C.unSetVip)

router.get("/balance/:id/:price",C.balanceAmount)

router.get("/getuser/:id",C.getUserA)

router.post("/deletegroup",C.deleteGroupe)

router.post("/addpointcontent",C.addPoint)

router.get("/getusers/:number",C.getUser)

module.exports = router;
