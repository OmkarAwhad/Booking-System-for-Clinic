const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	addClinicDetails,
	editClinicDetails,
	deleteClinicDetails,
	getClinicDetails,
} = require("../controller/clinic.controller");
const router = express.Router();

router.post("/addClinicDetails", auth, isAdmin, addClinicDetails);
router.post("/editClinicDetails", auth, isAdmin, editClinicDetails);
router.delete(
	"/deleteClinicDetails/:clinicDetailsId",
	auth,
	isAdmin,
	deleteClinicDetails
);
router.get("/getClinicDetails", auth, isAdmin, getClinicDetails);

module.exports = router;
