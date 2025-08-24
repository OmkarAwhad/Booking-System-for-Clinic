const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const Appointment = require("../models/appointment.model");

module.exports.assignDoctor = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);
		if (!user) {
			return res.json(new ApiError(404, "User not found"));
		}

		const existingDoctor = await Doctor.findOne({
			userId: userId,
		});
		if (existingDoctor) {
			return res.json(
				new ApiError(400, "This user is already a Doctor.")
			);
		}

		user.role = "Doctor";
		await user.save();

		const doctor = await Doctor.create({
			userId: userId,
			speciality: null,
			bio: null,
			availableDays: null,
			availableAt: null,
			availableTill: null,
		});

		return res.json(
			new ApiResponse(200, doctor, "Doctor assigned successfully")
		);
	} catch (error) {
		console.log("Error in assigning doctor", error);
		return res.json(new ApiError(500, "Error in assigning doctor"));
	}
};

module.exports.editDetails = async (req, res) => {
	try {
		const { speciality, bio, availableDays, availableAt, availableTill } =
			req.body;

		const doctorsUserId = req.user.id;

		const doctorDetails = await Doctor.findOne({
			userId: doctorsUserId,
		});
		if (!doctorDetails) {
			return res.json(new ApiError(404, "Doctor not found"));
		}

		if (speciality) doctorDetails.speciality = speciality;
		if (bio) doctorDetails.bio = bio;
		if (availableDays) doctorDetails.availableDays = availableDays;
		if (availableAt) doctorDetails.availableAt = availableAt;
		if (availableTill) doctorDetails.availableTill = availableTill;

		await doctorDetails.save();

		return res.json(
			new ApiResponse(
				200,
				doctorDetails,
				"Doctor details edited successfully"
			)
		);
	} catch (error) {
		console.log("Error in editing details of doctor", error);
		return res.json(
			new ApiError(500, "Error in editing details of doctor")
		);
	}
};

module.exports.getDoctorSlots = async (req, res) => {
	try {
		const { doctorId, date } = req.body;

		if (!doctorId || !date) {
			return res.json(
				new ApiError(400, "Doctor ID and date are required")
			);
		}

		const doctorDetails = await Doctor.findById(doctorId);
		if (!doctorDetails) {
			return res.json(new ApiError(404, "Doctor not found"));
		}

		if (
			!doctorDetails.availableDays ||
			!doctorDetails.availableAt ||
			!doctorDetails.availableTill
		) {
			return res.json(
				new ApiError(400, "Doctor availability not set")
			);
		}

		const requestedDate = new Date(date);
		const dayOfWeek = requestedDate.toLocaleDateString("en-US", {
			weekday: "long",
		});

		if (!doctorDetails.availableDays.includes(dayOfWeek)) {
			return res.json(
				new ApiResponse(
					200,
					{ availableSlots: [] },
					`Doctor is not available on ${dayOfWeek}`
				)
			);
		}

		const allTimeSlots = generateTimeSlots(
			doctorDetails.availableAt,
			doctorDetails.availableTill
		);

		const existingAppointments = await Appointment.find({
			doctorId: doctorId,
			date: requestedDate,
			status: { $ne: "cancelled" },
		});

		const bookedSlots = existingAppointments.map(
			(appointment) => appointment.appointmentTime
		);

		const availableSlots = allTimeSlots.filter(
			(slot) => !bookedSlots.includes(slot)
		);

		return res.json(
			new ApiResponse(
				200,
				{
					date: date,
					dayOfWeek: dayOfWeek,
					doctorAvailability: {
						from: doctorDetails.availableAt,
						to: doctorDetails.availableTill,
					},
					totalSlots: allTimeSlots.length,
					bookedSlots: bookedSlots,
					availableSlots: availableSlots,
				},
				"Doctor slots fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching slots of doctor", error);
		return res.json(
			new ApiError(500, "Error in fetching slots of doctor")
		);
	}
};

function generateTimeSlots(startTime, endTime, slotDuration = 30) {
	const slots = [];

	const parseTime = (timeStr) => {
		const cleanTime = timeStr.trim().toUpperCase();

		const timeMatch = cleanTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
		if (!timeMatch) {
			throw new Error(`Invalid time format: ${timeStr}`);
		}

		let [, hours, minutes, period] = timeMatch;
		hours = parseInt(hours);
		minutes = parseInt(minutes);

		// Convert to 24-hour format
		if (period === "PM" && hours !== 12) hours += 12;
		else if (period === "AM" && hours === 12) hours = 0;

		// If no AM/PM specified, assume 24-hour format
		return hours * 60 + minutes;
	};

	// Convert minutes back to HH:MM format
	const minutesToTime = (totalMinutes) => {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}`;
	};

	try {
		const startMinutes = parseTime(startTime);
		const endMinutes = parseTime(endTime);

		// Generate slots every 30 minutes
		for (let time = startMinutes; time < endMinutes; time += 30) {
			slots.push(minutesToTime(time));
		}
	} catch (error) {
		console.error("Error parsing time:", error);
		// Fallback to default slots if parsing fails
		return [
			"09:00",
			"09:30",
			"10:00",
			"10:30",
			"11:00",
			"11:30",
			"12:00",
			"12:30",
			"14:00",
			"14:30",
			"15:00",
			"15:30",
			"16:00",
			"16:30",
			"17:00",
			"17:30",
		];
	}

	return slots;
}
