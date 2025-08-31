const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const { ApiError } = require("../utils/ApiError.utils");
const User = require("../models/user.model");
const Appointment = require("../models/appointment.model");
const { feedbackEmail } = require("../mails/feedbackMail.template");
const { mailSender } = require("../utils/mailSender.utils");

const patientPopulate = [
	{ path: "userId", select: "name email phone age gender role" },
	{
		path: "doctorId",
		select: "speciality availableDays availableAt availableTill userId",
		populate: { path: "userId", select: "name email phone role" },
	},
];

module.exports.createRecord = async (req, res) => {
	try {
		const {
			userId,
			address,
			visitDate,
			symptoms,
			diagnosis,
			medicines,
			notes,
			doctorId,
		} = req.body;

		// Validate required fields
		if (!userId || !doctorId || !visitDate) {
			return res.json(
				new ApiError(
					400,
					"userId, doctorId, and visitDate are required"
				)
			);
		}

		// Check user exists
		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.json(new ApiError(401, "User doesn't exist"));
		}

		// Restrict patients from creating records
		const role = req.user.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(
					401,
					"Patients are not allowed to access this route"
				)
			);
		}

		// Check doctor exists
		const doctorDetails = await Doctor.findById(doctorId);
		if (!doctorDetails) {
			return res.json(new ApiError(401, "Doctor not found"));
		}

		// Create patient record
		const patientDetails = await Patient.create({
			userId: userDetails._id,
			doctorId: doctorDetails._id,
			address,
			visitDate: new Date(visitDate),
			symptoms,
			diagnosis,
			medicines,
			notes,
		});

		// Update corresponding appointment to completed
		const appointmentDate = new Date(visitDate);
		const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
		const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));

		const updatedAppointment = await Appointment.findOneAndUpdate(
			{
				patientId: userDetails._id,
				doctorId: doctorDetails._id,
				date: { $gte: startOfDay, $lte: endOfDay },
				status: "booked", // Only update if still booked
			},
			{
				$set: {
					status: "completed",
					attended: true,
					updatedAt: new Date(),
				},
			},
			{
				new: true,
				runValidators: true,
			}
		).populate("patientId", "name email");

      console.log(updatedAppointment)

		// Send feedback email if appointment was updated
		if (
			updatedAppointment &&
			updatedAppointment.patientId &&
			updatedAppointment.patientId.email
		) {
			try {
				await mailSender(
					updatedAppointment.patientId.email,
					"Feedback Request",
					feedbackEmail(updatedAppointment.patientId.name)
				);
				console.log(
					`Feedback email sent to ${updatedAppointment.patientId.email}`
				);
			} catch (emailError) {
				console.error("Error sending feedback email:", emailError);
				// Continue despite email failure to avoid blocking response
			}
		} else if (!updatedAppointment) {
			console.log(
				`No matching booked appointment found for patient ${userId} on ${visitDate}`
			);
		}

		// Populate patient record for response
		const populatedRecord = await patientDetails.populate(
			patientPopulate
		);

		return res.json(
			new ApiResponse(
				201,
				populatedRecord,
				"Patient record created and appointment updated successfully"
			)
		);
	} catch (error) {
		console.error("Error in creating patient record:", error);
		return res.json(
			new ApiError(500, "Error in creating patient record")
		);
	}
};

module.exports.editRecord = async (req, res) => {
	try {
		const {
			userId,
			address,
			visitDate,
			symptoms,
			diagnosis,
			medicines,
			notes,
			doctorId,
			recordId,
		} = req.body;

		const role = req.user?.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(
					401,
					"Patients are not allowed to edit records"
				)
			);
		}

		const recordDetails = await Patient.findById(recordId);
		if (!recordDetails) {
			return res.json(new ApiError(404, "Patient record not found"));
		}

		if (doctorId) {
			const doc = await Doctor.findById(doctorId);
			if (!doc) return res.json(new ApiError(404, "Doctor not found"));
			recordDetails.doctorId = doctorId;
		}
		if (userId) {
			const user = await User.findById(userId);
			if (!user) return res.json(new ApiError(404, "User not found"));
			recordDetails.userId = userId;
		}

		if (address) recordDetails.address = address;
		if (visitDate) recordDetails.visitDate = visitDate;
		if (symptoms) recordDetails.symptoms = symptoms;
		if (diagnosis) recordDetails.diagnosis = diagnosis;
		if (medicines) recordDetails.medicines = medicines;
		if (notes) recordDetails.notes = notes;

		await recordDetails.save();
		const populatedRecord = await recordDetails.populate(patientPopulate);

		return res.json(
			new ApiResponse(
				200,
				populatedRecord,
				"Patient record updated successfully"
			)
		);
	} catch (err) {
		console.error("Error in editing patient record", err);
		return res.json(new ApiError(500, "Error in editing patient record"));
	}
};

module.exports.getRecordByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return res.json(new ApiError(400, "userId is required"));
		}

		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.json(new ApiError(404, "User not found"));
		}

		const userRecords = await Patient.find({ userId: userId });

		return res.json(
			new ApiResponse(200, userRecords, "Patient records fetched")
		);
	} catch (err) {
		console.error("Error in getting records by user", err);
		return res.json(
			new ApiError(500, "Error in getting records by user")
		);
	}
};

module.exports.getAllRecords = async (req, res) => {
	try {
		const role = req.user?.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(
					401,
					"Patients are not allowed to access this route"
				)
			);
		}

		const recordDetails = await Patient.find({}).sort({ visitDate: -1 });

		return res.json(
			new ApiResponse(
				200,
				recordDetails,
				"All patient records fetched"
			)
		);
	} catch (err) {
		console.error("Error in getting all patient records", err);
		return res.json(
			new ApiError(500, "Error in getting all patient records")
		);
	}
};

module.exports.getSingleRecord = async (req, res) => {
	try {
		const { recordId } = req.params;

		const recordDetails = await Patient.findById(recordId).populate(
			patientPopulate
		);
		if (!recordDetails) {
			return res.json(new ApiError(404, "Patient record not found"));
		}

		return res.json(
			new ApiResponse(
				200,
				recordDetails,
				"Patient record fetched successfully"
			)
		);
	} catch (err) {
		console.error("Error in getting single patient record", err);
		return res.json(
			new ApiError(500, "Error in getting single patient record")
		);
	}
};

module.exports.deleteRecord = async (req, res) => {
	try {
		const { recordId } = req.params;

		const role = req.user?.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(
					401,
					"Patients are not allowed to delete records"
				)
			);
		}

		const recordDetails = await Patient.findByIdAndDelete(recordId);
		if (!recordDetails) {
			return res.json(new ApiError(404, "Patient record not found"));
		}

		return res.json(
			new ApiResponse(200, {}, "Patient record deleted successfully")
		);
	} catch (err) {
		console.error("Error in deleting patient record", err);
		return res.json(
			new ApiError(500, "Error in deleting patient record")
		);
	}
};
