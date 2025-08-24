const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         // required: true,
      },
      patientId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      doctorId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Doctor",
         required: true,
      },
      serviceId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Service",
         required: true,
      },
      appointmentTime: {
         type: String,
         required: true,
      },
      date: {
         type: Date,
         required: true,
      },
      attended: {
         type: Boolean,
         default: false,
      },
      status: {
         type: String,
         enum: ["booked", "cancelled", "completed"],
         default: "booked",
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
