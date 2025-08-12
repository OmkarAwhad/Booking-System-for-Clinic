const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			age,
			gender,
			password,
			confirmPassword,
		} = req.body;

		if (
			!name ||
			!email ||
			!phone ||
			!age ||
			!gender ||
			!password ||
			!confirmPassword
		) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const userDetails = await User.findOne({ email: email });
		if (userDetails) {
			return res.json(new ApiError(400, "User already exists"));
		}

		if (password !== confirmPassword) {
			return res.json(new ApiError(400, "Passwords aren't same"));
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const userData = await User.create({
			name: name,
			email: email,
			age: age,
			gender: gender,
			phone: phone,
			password: hashedPassword,
			role: "Patient",
		});

		return res.json(new ApiResponse(200, userData, "Sign up successful"));
	} catch (error) {
		console.log("Error in signing up", error);
		return res.json(new ApiError(500, "Error in signing up"));
	}
};

module.exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const userDetails = await User.findOne({ email: email });
		if (!userDetails) {
			return res.json(new ApiError(400, "User doesn't exists"));
		}

		if (!(await bcrypt.compare(password, userDetails.password))) {
			return res.json(new ApiError(400, "Invalid password"));
		}

		const payload = {
			id: userDetails._id,
			email: userDetails.email,
			role: userDetails.role,
		};
		const token = jwt.sign(payload, process.env.JWT_SECRET);

		return res
			.cookie("token", token)
			.json(
				new ApiResponse(
					200,
					{ userDetails, token },
					"Login successful"
				)
			);
	} catch (error) {
		console.log("Error in login", error);
		return res.json(new ApiError(500, "Error in login"));
	}
};
