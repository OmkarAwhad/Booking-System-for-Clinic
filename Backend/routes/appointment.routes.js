const express = require("express");
const { auth, isPatient } = require("../middlewares/auth.middleware");
const {
	createAppointment,
	editAppointment,
	getAllAppointments,
	getTodaysAppointments,
	cancelAppointment,
} = require("../controller/appointment.controller");
const router = express.Router();

router.post("/createAppointment", auth, isPatient, createAppointment);
router.post("/editAppointment", auth, isPatient, editAppointment);
router.get("/getAllAppointments", auth, getAllAppointments);
router.get("/getTodaysAppointments", auth, getTodaysAppointments);
router.post("/cancelAppointment", auth, cancelAppointment);

module.exports = router;
