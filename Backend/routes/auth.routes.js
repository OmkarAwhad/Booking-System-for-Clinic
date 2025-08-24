const express = require("express");
const router = express.Router();
const {
	signUp,
	login,
	changePassword,
	forgetPassword,
	verifyOTP,
} = require("../controller/auth.controller");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);

module.exports = router;
