const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const bcrypt = require("bcrypt");
const { mailSender } = require("../utils/mailSender.utils");
const { userCreatedMail } = require("../mails/userCreatedMail.template");

module.exports.createUser = async (req, res) => {
	try {
		const { name, email, phone, age, gender } = req.body;

		if (!name || !email || !phone || !age || !gender) {
			return res.json(new ApiError(400, "All fields are required"));
		}
      
		let password = email;
		let hashedPassword = await bcrypt.hash(password, 10);

		const userDetails = await User.findOne({ email: email });
		if (userDetails) {
			return res.json(new ApiError(400, "User already exists"));
		}

		const userData = await User.create({
			name: name,
			email: email,
			age: age,
			gender: gender,
			phone: phone,
			password: hashedPassword,
			role: "Patient",
		});

		try {
			await mailSender(
				email,
				"Your username and password ",
				userCreatedMail(email, email)
			);
		} catch (error) {
			console.log("Error in sending mail");
			return res.json(new ApiError(400, "Error in sending mail"));
		}

		return res.json(
			new ApiResponse(200, userData, "User created successfully")
		);
	} catch (error) {
		console.log("Error in creating user", error);
		return res.json(new ApiError(500, "Error in creating user"));
	}
};
