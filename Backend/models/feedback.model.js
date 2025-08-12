const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
	{
		appointmentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Appointment",
		},
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
		},
		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
