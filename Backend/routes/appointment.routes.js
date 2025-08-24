const express = require("express");
const { auth, isPatient } = require("../middlewares/auth.middleware");
const {
	createAppointment,
	editAppointment,
	getAllAppointments,
	getTodaysAppointments,
} = require("../controller/appointment.controller");
const router = express.Router();

router.post("/createAppointment", auth, isPatient, createAppointment);
router.post("/editAppointment", auth, isPatient, editAppointment);
router.get("/getAllAppointments", auth, getAllAppointments);
router.get("/getTodaysAppointments", auth, getTodaysAppointments);

module.exports = router;
