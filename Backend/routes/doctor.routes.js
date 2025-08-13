const express = require("express");
const router = express.Router();
const { assignDoctor } = require("../controller/doctor.controller");

router.post("/assign-doctor/:userId", assignDoctor);

module.exports = router;
