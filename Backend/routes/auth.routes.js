const express = require("express");
const router = express.Router();
const { signUp, login } = require("../controller/auth.controller");

router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
