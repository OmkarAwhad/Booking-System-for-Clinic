const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ApiError } = require("../utils/ApiError.utils");

exports.auth = async (req, res, next) => {
	try {
		const token =
			req.cookies?.token ||
			req.headers?.token ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.json(
				new ApiError(400, "Not authorized, Login Again")
			);
		}

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);

			req.user = decode;
		} catch (error) {
			return res.json(new ApiError(401, "Invalid token"));
		}

		next();
	} catch (error) {
		console.log(
			"Something went wrong while validating the token ",
			error.message
		);
		return res.json(
			new ApiError(
				500,
				"Something went wrong while validating the token"
			)
		);
	}
};

exports.isPatient = async (req, res, next) => {
	try {
		const role = req.user.role;
		if (role !== "Patient") {
			return res.json(
				new ApiError(
					401,
					"This is a protected route for patients only"
				)
			);
		}
		next();
	} catch (error) {
		console.log("Error in patient auth ", error.message);
		return res.json(new ApiError(500, "Error in patient auth"));
	}
};

exports.isDoctor = async (req, res, next) => {
	try {
		const role = req.user.role;
		if (role !== "Doctor") {
			return res.json(
				new ApiError(
					401,
					"This is a protected route for Doctors only"
				)
			);
		}
		next();
	} catch (error) {
		console.log("Error in Doctor auth ", error.message);
		return res.json(new ApiError(500, "Error in Doctor auth"));
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const role = req.user.role;
		if (role !== "Admin") {
			return res.json(
				new ApiError(
					401,
					"This is a protected route for Admins only"
				)
			);
		}
		next();
	} catch (error) {
		console.log("Error in Admin auth ", error.message);
		return res.json(new ApiError(500, "Error in Admin auth"));
	}
};
