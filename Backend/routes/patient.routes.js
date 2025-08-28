const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const {
	createRecord,
	editRecord,
	getRecordByUser,
	getAllRecords,
	getSingleRecord,
	deleteRecord,
} = require("../controller/patient.controller");
const router = express.Router();

router.post("/createRecord", auth, createRecord);
router.post("/editRecord", auth, editRecord);
router.get("/getRecordByUser/:userId", auth, getRecordByUser);
router.get("/getAllRecords", auth, getAllRecords);
router.get("/getSingleRecord/:recordId", auth, getSingleRecord);
router.delete("/deleteRecord/:recordId", auth, deleteRecord);

module.exports = router;
