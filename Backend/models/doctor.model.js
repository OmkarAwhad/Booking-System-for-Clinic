const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
	{
		speciality: {
			type: String,
		},
		bio: {
			type: String,
		},
		availableDays: {
			type: [String],
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
		},
		availableTill: {
			type: String,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
