const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["confirmation", "reminder", "notification", "feedback"],
			required: true,
		},
		appointmentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Appointment",
		},
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
		},
		status: {
			type: String,
			enum: ["sent", "failed"],
			default: "sent",
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Mail", mailSchema);
