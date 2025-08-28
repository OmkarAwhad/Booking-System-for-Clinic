const Clinic = require("../models/clinic.model");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const { ApiError } = require("../utils/ApiError.utils");

module.exports.addClinicDetails = async (req, res) => {
	try {
		const { name, address, phone, email, timings } = req.body;
		if (!name || !address || !phone || !email || !timings) {
			return res.json(new ApiError(401, "All fields are required"));
		}

		const clinicExists = await Clinic.exists({
			address,
		});
		if (clinicExists) {
			return res.json(
				new ApiError(
					401,
					"Clinic details already exist for this address"
				)
			);
		}

		const clinicDetails = await Clinic.create({
			name,
			address,
			phone,
			email,
			timings,
		});

		return res.json(
			new ApiResponse(
				201,
				clinicDetails,
				"Clinic details added successfully"
			)
		);
	} catch (error) {
		console.error("Error in adding clinic details", err);
		return res.json(new ApiError(500, "Error in adding clinic details"));
	}
};

module.exports.editClinicDetails = async (req, res) => {
	try {
		const { name, address, phone, email, timings, clinicDetailsId } =
			req.body;

		const clinicDetails = await Clinic.findById(clinicDetailsId);
		if (!clinicDetails) {
			return res.json(new ApiError(401, "Clinic details not found"));
		}

		if (name) clinicDetails.name = name;
		if (address) clinicDetails.address = address;
		if (phone) clinicDetails.phone = phone;
		if (email) clinicDetails.email = email;
		if (timings) clinicDetails.timings = timings;

		await clinicDetails.save();

		return res.json(
			new ApiResponse(
				201,
				clinicDetails,
				"Clinic details edited successfully"
			)
		);
	} catch (error) {
		console.error("Error in editing clinic details", err);
		return res.json(new ApiError(500, "Error in editing clinic details"));
	}
};

module.exports.deleteClinicDetails = async (req, res) => {
	try {
		const { clinicDetailsId } = req.params;

		const clinicDetails = await Clinic.findById(clinicDetailsId);
		if (!clinicDetails) {
			return res.json(new ApiError(401, "Clinic details not found"));
		}

		await Clinic.findByIdAndDelete(clinicDetailsId);

		return res.json(
			new ApiResponse(201, {}, "Clinic details deleted successfully")
		);
	} catch (error) {
		console.error("Error in deleting clinic details", err);
		return res.json(
			new ApiError(500, "Error in deleting clinic details")
		);
	}
};

module.exports.getClinicDetails = async (req, res) => {
	try {
		const clinicDetails = await Clinic.find({});
		return res.json(
			new ApiResponse(
				201,
				clinicDetails,
				"Clinic details fetched successfully"
			)
		);
	} catch (error) {
		console.error("Error in fetching clinic details", err);
		return res.json(
			new ApiError(500, "Error in fetching clinic details")
		);
	}
};
