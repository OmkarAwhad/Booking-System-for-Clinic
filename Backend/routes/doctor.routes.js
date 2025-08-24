const express = require("express");
const router = express.Router();
const {
	assignDoctor,
	editDetails,
	getDoctorSlots,
} = require("../controller/doctor.controller");
const { isDoctor, auth, isAdmin } = require("../middlewares/auth.middleware");

router.post("/assign-doctor/:userId", auth, isAdmin, assignDoctor);
router.post("/editDetails", auth, isDoctor, editDetails);
router.get("/getDoctorSlots", auth, getDoctorSlots);

module.exports = router;
