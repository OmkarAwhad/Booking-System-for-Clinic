import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import noBgLogo from "../../assets/whiteBgLogo.png";
import { useDispatch } from "react-redux";
import { verifyOTP } from "../../services/operations/auth.service";

function VerifyOTP() {
	const { handleSubmit } = useForm();
	const [otp, setOtp] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const email = localStorage.getItem("resetEmail");
	const dispatch = useDispatch();

	const submitHandler = async () => {
		if (otp.length !== 6) {
			toast.error("Please enter a 6-digit OTP");
			return;
		}
		try {
			const response = await dispatch(verifyOTP(email, otp));
			if (response) {
				toast.success(response.message || "OTP verified");
				localStorage.setItem(
					"resetToken",
					response.data.resetToken
				);
				localStorage.removeItem("resetEmail");
				navigate("/change-password");
			} else {
				toast.error(
					(response && response.message) || "Invalid OTP"
				);
			}
		} catch (error) {
			toast.error("Error in verifying OTP");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br text-black from-teal-100 to-teal-300 flex flex-col items-center justify-center p-6">
			<div className="flex justify-center mb-6">
				<img
					src={noBgLogo}
					className="h-16 rounded-md object-contain"
					alt="Logo"
				/>
			</div>
			<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-teal-500/50 p-8">
				<h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
					Verify OTP
				</h2>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="space-y-5"
				>
					<div>
						<label className="block text-base font-medium text-teal-500 mb-1">
							Enter OTP
						</label>
						<OtpInput
							value={otp}
							onChange={setOtp}
							numInputs={6}
							renderSeparator={
								<span className="mx-1">-</span>
							}
							renderInput={(props) => (
								<input
									{...props}
									className="min-w-12 h-10 text-center text-xl border border-main-teal rounded-lg outline-none transition-colors"
								/>
							)}
							inputStyle="focus:border-teal-600"
							shouldAutoFocus
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
					>
						Verify OTP
					</button>
				</form>
				<p className="text-center text-sm text-gray-600 mt-4">
					Back to{" "}
					<a
						href="/forgot-password"
						className="text-teal-600 hover:underline"
					>
						Forgot Password
					</a>
				</p>
			</div>
		</div>
	);
}

export default VerifyOTP;
