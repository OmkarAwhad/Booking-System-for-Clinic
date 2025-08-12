const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		address: {
			type: String,
		},
		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
		},
		visitDate: {
			type: Date,
		},
		symptoms: {
			type: String,
		},
		diagnosis: {
			type: String,
		},
		medicines: {
			type: String,
		},
		notes: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
