const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.assignDoctor = async (req, res) => {
	try{
        const { userId } = req.params;
		console.log("1");

        const user = await User.findById(userId);
		console.log("1");
		if (!user) {
			return res.json(new ApiError(404, "User not found"));
		}
		console.log("1");

        user.role = "Doctor";
		await user.save();
		console.log("1");

        const existingDoctor = await Doctor.findOne({ userId });
		if (existingDoctor) {
			return res.json(new ApiError(400, "This user is already a Doctor."));
		}
		console.log("1");

        const doctor = await Doctor.create({ userId });

        return res.json(
			new ApiResponse(200, doctor, "Doctor assigned successfully")
		);
		console.log("1");
    }
    catch(error){
        console.log("Error in assigning doctor", error);
		return res.json(new ApiError(500, "Error in assigning doctor"));
    }
};
