const express = require("express");

const C = require("../controllers/dev");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST
router.post("/addloc/:id", C.addLocations);

// GET
router.get("/all", C.allUser);
router.get("/allgroup", C.allGroup);

router.post("/delall", C.delAll);
router.get("/del/:id", C.del);

router.get("/updateuser/:id", C.updateUser);

router.get("/create", C.create);

router.get("/deletedevicetoken",C.deleteAllDeviceToken)

router.get("/deleteallpoint",C.setAllPointTo0)

router.get("/changepassto",C.changeAllPass)

router.post("/testsms",C.smsCheckDev)

// router.get("/sms/:phone/:code",C.smsCheckDev)

module.exports = router;
