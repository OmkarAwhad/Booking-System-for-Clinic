const Service = require("../models/service.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createService = async (req, res) => {
	try {
		const { name, description, duration, fee } = req.body;

		if (!name || !description) {
			return res.json(new ApiError(400, "Name and description are required"));
		}

		const existingService = await Service.findOne({ name });
		if (existingService) {
			return res.json(new ApiError(400, "Service already exists"));
		}

		const service = await Service.create({ name, description, duration, fee });
		return res.json(
			new ApiResponse(200, service, "Service created successfully")
		);
	} catch (error) {
		console.log("Error in creating service", error);
		return res.json(new ApiError(500, "Error in creating service"));
	}
};

module.exports.updateService = async (req, res) => {
	try {
		const { serviceId } = req.params;
		const { name, description, duration, fee } = req.body;

		const service = await Service.findById(serviceId);
		if (!service) {
			return res.json(new ApiError(404, "Service not found"));
		}

		if (name) service.name = name;
		if (description) service.description = description;
		if (duration) service.duration = duration;
		if (fee !== undefined) service.fee = fee;

		await service.save();
		return res.json(
			new ApiResponse(200, service, "Service updated successfully")
		);
	} catch (error) {
		console.log("Error in updating service", error);
		return res.json(new ApiError(500, "Error in updating service"));
	}
};

module.exports.deleteService = async (req, res) => {
	try {
		const { serviceId } = req.params;

		const service = await Service.findByIdAndDelete(serviceId);
		if (!service) {
			return res.json(new ApiError(404, "Service not found"));
		}

		return res.json(
			new ApiResponse(200, {}, "Service deleted successfully")
		);
	} catch (error) {
		console.log("Error in deleting service", error);
		return res.json(new ApiError(500, "Error in deleting service"));
	}
};

module.exports.getServiceById = async (req, res) => {
	try {
		const { serviceId } = req.params;
		const service = await Service.findById(serviceId);
		if (!service) {
			return res.json(new ApiError(404, "Service not found"));
		}
		return res.json(
			new ApiResponse(200, service, "Service fetched successfully")
		);
	} catch (error) {
		console.log("Error in fetching service by id", error);
		return res.json(new ApiError(500, "Error in fetching service"));
	}
};

module.exports.getAllServices = async (req, res) => {
	try {
		const services = await Service.find();
		return res.json(
			new ApiResponse(
				200,
				services,
				"All services fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching all services", error);
		return res.json(new ApiError(500, "Error in fetching all services"));
	}
};
