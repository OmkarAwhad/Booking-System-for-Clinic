import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { login } from "../services/operations/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../slices/auth.slice";
import noBgLogo from "../assets/whiteBgLogo.png";

function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { user } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const submitHandler = async (data) => {
		try {
			const response = await dispatch(login(data, navigate));
			if (response) {
				toast.success("Login successfully");
				dispatch(setToken(response.token));
				if (!user) dispatch(setUser(response.userDetails));
				navigate("/");
			}
		} catch (error) {
			toast.error("Login failed");
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
			<div className="w-2/5 bg-white rounded-2xl shadow-2xl shadow-teal-500/50 p-8">
				<h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
					Log in
				</h2>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="space-y-5"
				>
					<div>
						<label className="block text-base font-medium text-teal-500 mb-1">
							Email
						</label>
						<input
							type="email"
							className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
							placeholder="Enter your email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Invalid email address",
								},
							})}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="flex-1">
						<label className="block text-base font-medium text-teal-500 mb-1">
							Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
							placeholder="Enter your password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 8,
									message: "Password must be at least 8 characters",
								},
							})}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
					>
						Log in
					</button>
				</form>
				<div className="flex justify-between">
					<p className="text-center text-sm text-gray-600 mt-4">
						<a
							href="/forgot-password"
							className="text-teal-600 hover:underline"
						>
							Forgot Password?
						</a>
					</p>
					<p className="text-center text-sm text-gray-600 mt-4">
						Don't have an account?{" "}
						<a
							href="/signup"
							className="text-teal-600 hover:underline"
						>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
