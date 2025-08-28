const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
		},
		address: {
			type: String,
		},
		visitDate: {
			type: Date,
			default: Date.now,
		},
		symptoms: {
			type: [String],
		},
		diagnosis: {
			type: [String],
		},
		medicines: [
			{
				name: String,
				dosage: String,
				frequency: String,
			},
		],
		notes: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
