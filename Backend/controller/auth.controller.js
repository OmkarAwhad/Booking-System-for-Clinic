const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

module.exports.signUp = async (req, res) => {
	try {
		const { name, email, phone, age, gender, password, confirmPassword } =
			req.body;

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

module.exports.forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.json(new ApiError(400, "Email is required"));
		}

		const checkUserPresent = await User.findOne({ email: email });
		if (!checkUserPresent) {
			return res.json(new ApiError(404, "User does not exist"));
		}

		const otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const otpDocument = new OTP({
			email,
			otp,
		});

		await otpDocument.save();

		return res.json(
			new ApiResponse(200, null, "OTP sent successfully to your email")
		);
	} catch (error) {
		console.error("Error in forget password:", error);
		return res.json(new ApiError(500, "Error in sending OTP"));
	}
};

module.exports.verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.json(new ApiError(400, "Email and OTP are required"));
		}

		const otpDocument = await OTP.findOne({ email, otp });

		if (!otpDocument) {
			return res.json(new ApiError(400, "Invalid or expired OTP"));
		}

		const userDetails = await User.findOne({ email });
		if (!userDetails) {
			return res.json(new ApiError(404, "User not found"));
		}

		await OTP.deleteOne({ _id: otpDocument._id });

		const resetToken = jwt.sign(
			{ id: userDetails._id, email: email },
			process.env.JWT_SECRET
		);

		return res.json(
			new ApiResponse(200, { resetToken }, "OTP verified successfully")
		);
	} catch (error) {
		console.error("Error in OTP verification:", error);
		return res.json(new ApiError(500, "Error in verifying OTP"));
	}
};

module.exports.changePassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		if (!newPassword) {
			return res.json(new ApiError(400, "New password is required"));
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			return res.json(new ApiError(401, "Invalid or expired token"));
		}

		const user = await User.findById(decoded.id);
		if (!user) {
			return res.json(new ApiError(404, "User not found"));
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		await user.save();

		return res.json(
			new ApiResponse(200, null, "Password changed successfully")
		);
	} catch (error) {
		console.error("Error in changing password:", error);
		return res.json(new ApiError(500, "Error in changing password"));
	}
};
