const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
require("./config/mongoose").connect();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");
const doctorRoutes = require("./routes/doctor.routes");
const receptionistRoutes = require("./routes/receptionist.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const patientRoutes = require("./routes/patient.routes");
const clinicRoutes = require("./routes/clinic.routes");

app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/clinic", clinicRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/receptionist", receptionistRoutes);
app.use("/api/v1/doctor", doctorRoutes);

require('./config/reminderJob') // cron job for 8AM Reminder

app.get("/", (req, res) => {
	res.send("Backend Working");
});

app.listen(PORT, (req, res) => {
	console.log(`Backend running at port ${PORT}`);
});

