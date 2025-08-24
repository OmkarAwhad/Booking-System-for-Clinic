const express = require("express");
const router = express.Router();
const {
	auth,
	isAdmin,
	isReceptionist,
} = require("../middlewares/auth.middleware");
const { createUser } = require("../controller/receptionist.controller");

router.post("/createUser", auth, isReceptionist, createUser);

module.exports = router;
