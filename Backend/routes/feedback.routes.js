const express = require("express");
const {
	createFeedback,
	deleteFeedback,
	getAFeedbackById,
	getAllFeedback,
} = require("../controller/feedback.controller");
const router = express.Router();
const { auth, isPatient } = require("../middlewares/auth.middleware");

router.post("/createFeedback", auth, isPatient, createFeedback);
router.get("/getAllFeedback", auth, getAllFeedback);
router.get("/getAFeedbackById/:feedbackId", auth, getAFeedbackById);
router.delete("/deleteFeedback/:feedbackId", auth, isPatient, deleteFeedback);

module.exports = router;
