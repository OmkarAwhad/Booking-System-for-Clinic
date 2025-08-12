const express = require("express");
const {
	createService,
	updateService,
	deleteService,
	getServiceById,
	getAllServices,
} = require("../controller/service.controller");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth.middleware");

router.post("/createService", auth, isAdmin, createService);
router.post("/updateService/:serviceId", auth, isAdmin, updateService);
router.delete("/deleteService/:serviceId", auth, isAdmin, deleteService);
router.get("/getServiceById/:serviceId", getServiceById);
router.get("/getAllServices", getAllServices);

module.exports = router;
