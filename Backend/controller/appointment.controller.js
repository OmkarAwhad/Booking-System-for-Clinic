const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const { ApiError } = require("../utils/ApiError.utils");

module.exports.createAppointment = async (req, res) => {
	try {
		const userId = req.user.id;

		const { title, doctorId, serviceId, appointmentTime, date } =
			req.body;

		if (!title || !doctorId || !serviceId || !appointmentTime || !date) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.json(new ApiError(401, "User doesn't exist"));
		}
		if (userDetails.role !== "Patient") {
			return res.json(
				new ApiError(401, "Only patients can book a appointment")
			);
		}

		const doctorDetails = await Doctor.findById(doctorId);
		if (!doctorDetails) {
			return res.json(new ApiError(404, "Doctor not found"));
		}

		const serviceDetails = await Service.findById(serviceId);
		if (!serviceDetails) {
			return res.json(new ApiError(404, "Service not found"));
		}

		const appointmentDate = new Date(date);
		const appointmentDateTime = new Date(`${date}T${appointmentTime}`);

		if (appointmentDateTime < new Date()) {
			return res.json(
				new ApiError(400, "Cannot book appointment in the past")
			);
		}

		const existing = await Appointment.findOne({
			doctorId: doctorDetails._id,
			date: appointmentDate,
			appointmentTime: appointmentTime,
		});

		if (existing) {
			return res.json(
				new ApiError(
					400,
					"This slot is already booked. Please choose another."
				)
			);
		}

		const appointmentDetails = await Appointment.create({
			title: title,
			patientId: userDetails._id,
			doctorId: doctorDetails._id,
			serviceId: serviceDetails._id,
			appointmentTime: appointmentTime, // Store as string
			date: appointmentDate, // Store as Date object
			attended: false,
			status: "booked",
		});

		return res.json(
			new ApiResponse(
				200,
				appointmentDetails,
				"Appointment booked successfully"
			)
		);
	} catch (error) {
		console.log("Error in creating appointment", error);
		return res.json(new ApiError(500, "Error in creating appointment"));
	}
};

module.exports.editAppointment = async (req, res) => {
	try {
		const userId = req.user.id;

		const {
			title,
			doctorId,
			serviceId,
			appointmentTime,
			date,
			appointmentId,
		} = req.body;

		const appointmentDetails = await Appointment.findById(appointmentId);
		if (!appointmentDetails) {
			return res.json(
				new ApiError(404, "Appointment details not found")
			);
		}

		if (appointmentDetails.patientId.toString() !== userId) {
			return res.json(
				new ApiError(403, "You can only edit your own appointments")
			);
		}

		if (doctorId) {
			const doctorDetails = await Doctor.findById(doctorId);
			if (!doctorDetails) {
				return res.json(new ApiError(404, "Doctor not found"));
			}
		}

		if (serviceId) {
			const serviceDetails = await Service.findById(serviceId);
			if (!serviceDetails) {
				return res.json(new ApiError(404, "Service not found"));
			}
		}

		if (date || appointmentTime) {
			let dateStr;
			if (date) {
				dateStr = date;
			} else {
				const existingDate = new Date(appointmentDetails.date);
				dateStr = existingDate.toISOString().split("T")[0];
			}

			const timeStr =
				appointmentTime || appointmentDetails.appointmentTime;

			const appointmentDateTime = new Date(`${dateStr}T${timeStr}`);

			if (appointmentDateTime < new Date()) {
				return res.json(
					new ApiError(
						400,
						"Cannot reschedule to past date/time"
					)
				);
			}
		}

		if (date || doctorId || appointmentTime) {
			const checkDate = date
				? new Date(date)
				: appointmentDetails.date;
			const checkDoctorId = doctorId || appointmentDetails.doctorId;
			const checkTime =
				appointmentTime || appointmentDetails.appointmentTime;

			const existing = await Appointment.findOne({
				doctorId: checkDoctorId,
				date: checkDate,
				appointmentTime: checkTime,
				_id: { $ne: appointmentId },
			});

			if (existing) {
				return res.json(
					new ApiError(
						400,
						"This slot is already booked. Please choose another."
					)
				);
			}
		}

		if (title) appointmentDetails.title = title;
		if (doctorId) appointmentDetails.doctorId = doctorId;
		if (serviceId) appointmentDetails.serviceId = serviceId;
		if (appointmentTime)
			appointmentDetails.appointmentTime = appointmentTime;
		if (date) appointmentDetails.date = new Date(date);

		await appointmentDetails.save();

		const updatedAppointment = await Appointment.findById(appointmentId)
			.populate("patientId")
			.populate("doctorId")
			.populate("serviceId");

		return res.json(
			new ApiResponse(
				200,
				updatedAppointment,
				"Appointment edited successfully"
			)
		);
	} catch (error) {
		console.log("Error in editing appointment", error);
		return res.json(new ApiError(500, "Error in editing appointment"));
	}
};

module.exports.getAllAppointments = async (req, res) => {
	try {
		const role = req.user.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(401, "Patients are restricted from this route")
			);
		}

		const appointmentDetails = await Appointment.find({})
			.sort({
				createdAt: -1,
			})
			.populate("patientId")
			.populate("doctorId")
			.populate("serviceId")
			.exec();
		if (!appointmentDetails || appointmentDetails.length === 0) {
			return res.json(new ApiError(404, "No appointments found"));
		}

		return res.json(
			new ApiResponse(
				200,
				appointmentDetails,
				"Appointments Fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching all appointments", error);
		return res.json(
			new ApiError(500, "Error in fetching all appointments")
		);
	}
};

module.exports.getTodaysAppointments = async (req, res) => {
	try {
		const role = req.user.role;
		if (role === "Patient") {
			return res.json(
				new ApiError(401, "Patients are restricted from this route")
			);
		}

		const today = new Date();
		const todayStart = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const todayEnd = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 1
		);

		const appointmentDetails = await Appointment.find({
			date: {
				$gte: todayStart,
				$lt: todayEnd,
			},
		})
			.populate("patientId")
			.populate("doctorId")
			.populate("serviceId")
			.exec();

		return res.json(
			new ApiResponse(
				200,
				appointmentDetails,
				"Today's appointments fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching todays appointments", error);
		return res.json(
			new ApiError(500, "Error in fetching todays appointments")
		);
	}
};

module.exports.deleteAppointment = async (req, res) => {
	try {
		const userId = req.user.id;
		const { appointmentId } = req.body;

		if (!appointmentId) {
			return res.json(new ApiError(400, "Appointment ID is required"));
		}

		const appointmentDetails = await Appointment.findById(appointmentId);
		if (!appointmentDetails) {
			return res.json(new ApiError(404, "Appointment not found"));
		}

		if (appointmentDetails.patientId.toString() !== userId) {
			return res.json(
				new ApiError(
					403,
					"You can only delete your own appointments"
				)
			);
		}

		await Appointment.findByIdAndDelete(appointmentId);

		return res.json(
			new ApiResponse(200, null, "Appointment deleted successfully")
		);
	} catch (error) {
		console.log("Error in deleting appointment", error);
		return res.json(new ApiError(500, "Error in deleting appointment"));
	}
};
