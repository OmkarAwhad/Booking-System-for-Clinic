const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: String,
		},
		fee: {
			type: Number,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
