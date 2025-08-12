const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
	{
		specialty: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
		},
		availableDays: {
			type: String,
			required: true,
			enum: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			],
		},
		availableAt: {
			type: String,
			required: true,
		},
		availableTill: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
