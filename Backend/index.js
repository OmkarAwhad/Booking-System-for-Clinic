const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;
require("./config/mongoose").connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
	res.send("Backend Working");
});

app.listen(PORT, (req, res) => {
	console.log(`Backend running at port ${PORT}`);
});
