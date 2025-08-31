const Feedback = require("../models/feedback.model");
const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createFeedback = async (req, res) => {
	try {
		const { rating, comment, doctorId, patientId, appointmentId } =
			req.body;
		const userId = req.user.id; // From auth middleware

		if (!rating || !doctorId || !patientId || !appointmentId) {
			return res.json(
				new ApiError(
					400,
					"Rating, doctorId, patientId, and appointmentId are required"
				)
			);
		}

		if (rating < 1 || rating > 5) {
			return res.json(
				new ApiError(400, "Rating must be between 1 and 5")
			);
		}

		const userDetails = await User.findById(patientId);
		if (!userDetails) {
			return res.json(new ApiError(404, "User patient not found"));
		}

		const doctorDetails = await Doctor.findById(doctorId);
		if (!doctorDetails) {
			return res.json(new ApiError(404, "Doctor not found"));
		}

		const appointmentDetails = await Appointment.findById(
			appointmentId
		).populate("patientId", "name email");
		if (!appointmentDetails) {
			return res.json(new ApiError(404, "Appointment not found"));
		}
		if (appointmentDetails.status !== "completed") {
			return res.json(
				new ApiError(
					400,
					"Feedback can only be submitted for completed appointments"
				)
			);
		}
		if (
			appointmentDetails.patientId._id.toString() !== userId ||
			patientId.toString() !== userId
		) {
			return res.json(
				new ApiError(
					403,
					"You can only submit feedback for your own appointments"
				)
			);
		}

		const existingFeedback = await Feedback.findOne({ appointmentId });
		if (existingFeedback) {
			return res.json(
				new ApiError(
					400,
					"Feedback already submitted for this appointment"
				)
			);
		}

		const feedbackDetails = await Feedback.create({
			appointmentId,
			patientId,
			doctorId,
			rating,
			comment,
		});

		const populatedFeedback = await Feedback.findById(feedbackDetails._id)
			.populate("patientId", "userId")
			.populate("doctorId", "speciality userId")
			.populate({
				path: "doctorId",
				populate: { path: "userId", select: "name email" },
			})
			.populate("appointmentId", "date appointmentTime");

		return res.json(
			new ApiResponse(
				201,
				populatedFeedback,
				"Feedback submitted successfully"
			)
		);
	} catch (error) {
		console.error("Error in sending feedback:", error);
		return res.json(new ApiError(500, "Error in sending feedback"));
	}
};

module.exports.getAllFeedback = async (req, res) => {
	try {
		const role = req.user.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(
					403,
					"Patients are not allowed to access this route"
				)
			);
		}

		const feedbackDetails = await Feedback.find({})
			.sort({ createdAt: -1 })
			.populate("patientId", "userId")
			.populate("doctorId", "speciality userId")
			.populate({
				path: "doctorId",
				populate: { path: "userId", select: "name email" },
			})
			.populate("appointmentId", "date appointmentTime");

		if (!feedbackDetails || feedbackDetails.length === 0) {
			return res.json(new ApiError(404, "No feedback found"));
		}

		return res.json(
			new ApiResponse(
				200,
				feedbackDetails,
				"All feedback fetched successfully"
			)
		);
	} catch (error) {
		console.error("Error in fetching all feedback:", error);
		return res.json(new ApiError(500, "Error in fetching all feedback"));
	}
};

module.exports.getAFeedbackById = async (req, res) => {
	try {
		const { feedbackId } = req.params;
		const userId = req.user.id;
		const role = req.user.role;

      if (role === "Patient") {
			return res.json(
				new ApiError(
					403,
					"Patients are not allowed to access this route"
				)
			);
		}

		if (!feedbackId) {
			return res.json(new ApiError(400, "Feedback ID is required"));
		}

		const feedbackDetails = await Feedback.findById(feedbackId)
			.populate("patientId", "userId")
			.populate("doctorId", "speciality userId")
			.populate({
				path: "doctorId",
				populate: { path: "userId", select: "name email" },
			})
			.populate("appointmentId", "date appointmentTime");

		if (!feedbackDetails) {
			return res.json(new ApiError(404, "Feedback not found"));
		}

		if (
			role === "Patient" &&
			feedbackDetails.patientId._id.toString() !== userId
		) {
			return res.json(
				new ApiError(403, "You can only view your own feedback")
			);
		}

		return res.json(
			new ApiResponse(
				200,
				feedbackDetails,
				"Feedback fetched successfully"
			)
		);
	} catch (error) {
		console.error("Error in fetching feedback:", error);
		return res.json(new ApiError(500, "Error in fetching feedback"));
	}
};

module.exports.deleteFeedback = async (req, res) => {
	try {
		const { feedbackId } = req.params;

		if (!feedbackId) {
			return res.json(new ApiError(400, "Feedback ID is required"));
		}

		const feedbackDetails = await Feedback.findByIdAndDelete(feedbackId);
		if (!feedbackDetails) {
			return res.json(new ApiError(404, "Feedback not found"));
		}

		return res.json(
			new ApiResponse(200, {}, "Feedback deleted successfully")
		);
	} catch (error) {
		console.error("Error in deleting feedback:", error);
		return res.json(new ApiError(500, "Error in deleting feedback"));
	}
};
