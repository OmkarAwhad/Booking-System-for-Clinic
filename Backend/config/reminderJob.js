const cron = require("node-cron");
const Appointment = require("../models/appointment.model");
const { mailSender } = require("../utils/mailSender.utils");
const { reminderMail } = require("../mails/reminderMail.template");

const sendReminders = async () => {
	try {
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));

		const todaysAppointments = await Appointment.find({
			date: { $gte: startOfDay, $lte: endOfDay },
			status: "booked",
		}).populate("patientId", "name email");

		let sentCount = 0;
		let skippedCount = 0;
		const errors = [];

		for (const appointment of todaysAppointments) {
			if (!appointment.patientId || !appointment.patientId.email) {
				console.log(
					`Skipping appointment ${appointment._id}: No valid patient email`
				);
				skippedCount++;
				continue;
			}

			try {
				await mailSender(
					appointment.patientId.email,
					"Appointment Reminder",
					reminderMail(
						appointment.patientId.name,
						appointment.date,
						appointment.appointmentTime
					)
				);
				console.log(
					`Reminder sent to ${appointment.patientId.email} for appointment ${appointment._id}`
				);
				sentCount++;
			} catch (error) {
				console.error(
					`Error sending reminder to ${appointment.patientId.email}:`,
					error
				);
				errors.push(
					`Failed to send to ${appointment.patientId.email}: ${error.message}`
				);
			}
		}

		console.log(
			`Reminder job completed: ${sentCount} emails sent, ${skippedCount} skipped, ${errors.length} errors`
		);
		if (errors.length > 0) {
			console.error("Errors encountered:", errors);
		}
	} catch (error) {
		console.error("Error in reminder job:", error);
	}
};

cron.schedule("30 2 * * *", sendReminders, {
	timezone: "Asia/Kolkata",
});

module.exports = { sendReminders };
