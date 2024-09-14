const express = require("express");

const C = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

// POST

// ! OK 1
router.post("/register", C.register);

router.post("/addadmin", protect ,C.addAdmin);

router.post("/updateadmin",protect,C.updateAdmin)

router.post("/completeregister", C.completeRegister);

// ! ok
router.post("/login", C.login);


router.post("/loginadmin", C.loginAdmin);

// ! nist
router.get("/recovery/:phone", C.forgotPasswordCode);

router.get("/checkcodepass/:code/:phone", C.checkCodePass);

router.get("/changepassword/:phone/:pass", C.forgotPassword);

router.post("/addgroup/:id", C.addGroup);

// router.post("/addpoint/:id", C.addPoint); 

// ! nist
router.post("/changepassword", protect, C.changePassword);

router.post("/getdevicetoken", protect, C.getDeviceToken);

router.post("/removedevicetoken", protect, C.removeDeviceToken);

// PUT
router.put("/updatepassword", protect, C.updatePassword);

router.put("/resetpassword/:resettoken", C.resetPassword);

// ! ok
router.post("/picprofile", protect, C.pictureProfile);

// GET
router.get("/checkphone/:phone", C.checkPhone);

router.get("/welcome",protect, C.pushWelcome);
// ! ok
router.get("/changeusername/:username", protect, C.changeUsername);

// ! ok 2
router.get("/checksms/:code/:phone", C.checkCode);

// ! nist
router.get("/againcode/:phone", C.againCode);

// ! ok
router.get("/me", protect, C.getMe);

router.get("/seen", protect, C.seenUser);
router.get("/active/:id",protect ,C.activeUser);
router.get("/deactive/:id",protect ,C.deActiveUser);
router.get("/allusers", C.getAllUsers);

// ! nist
router.get(
  "/infophone/:deviceToken/:ipAddress/:osPhone/:modelPhone/:brandPhone",
  protect,
  C.token
);

router.get("/logout", C.logout);

router.post("/sms", C.sms);



router.get("/alladmin", C.allAdmin);

router.get("/checktoken", protect, C.checkToken);

router.get("/requestBank", C.requestBank);

router.get("/getchartinfo",protect, C.getChartInfo);

router.get("/totaldata", C.totalData);

router.get("/genrateinviteurl",protect, C.generateQrUrlForInvite);

router.get("/invitepoint/:id",C.inviteUrlAddPoint)


router.get("/checksss/:phone/:code",C.smsCheckOk)

module.exports = router;
