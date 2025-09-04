import React from "react";
import noBgLogo from "../assets/whiteBgLogo.png";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signup } from "../services/operations/auth.service";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/auth.slice";
import toast from "react-hot-toast";

function SignupPage() {
	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
	} = useForm();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const password = watch("password");

	const onSubmit = async (data) => {
		try {
			const response = await dispatch(signup(data, navigate));
			if (response) {
				toast.success("User registered successfully");
				dispatch(setUser(response));
				navigate("/login")
			}
		} catch (error) {
			toast.error("Registration failed");
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
					Create Your Account
				</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-5"
				>
					<div>
						<label className="block text-base font-medium text-teal-500 mb-1">
							Name
						</label>
						<input
							type="text"
							className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
							placeholder="Enter your name"
							{...register("name", {
								required: "Name is required",
								minLength: {
									value: 2,
									message: "Name must be at least 2 characters",
								},
							})}
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

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

					<div>
						<label className="block text-base font-medium text-teal-500 mb-1">
							Phone Number
						</label>
						<input
							type="tel"
							className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
							placeholder="Enter your phone number"
							{...register("phone", {
								required: "Phone number is required",
								pattern: {
									value: /^\+?[1-9]\d{1,14}$/,
									message: "Invalid phone number",
								},
							})}
						/>
						{errors.phone && (
							<p className="text-red-500 text-sm mt-1">
								{errors.phone.message}
							</p>
						)}
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="block text-base font-medium text-teal-500 mb-1">
								Age
							</label>
							<input
								type="number"
								className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
								placeholder="Enter your age"
								{...register("age", {
									required: "Age is required",
									min: {
										value: 10,
										message: "You must be at least 10 years old",
									},
									max: {
										value: 120,
										message: "Invalid age",
									},
								})}
							/>
							{errors.age && (
								<p className="text-red-500 text-sm mt-1">
									{errors.age.message}
								</p>
							)}
						</div>
						<div className="flex-1">
							<label className="block text-base font-medium text-teal-500 mb-1">
								Gender
							</label>
							<select
								className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
								{...register("gender", {
									required: "Gender is required",
								})}
							>
								<option value="">
									Select your gender
								</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
							{errors.gender && (
								<p className="text-red-500 text-sm mt-1">
									{errors.gender.message}
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
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
						<div className="flex-1">
							<label className="block text-base font-medium text-teal-500 mb-1">
								Confirm Password
							</label>
							<input
								type="password"
								className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
								placeholder="Confirm your password"
								{...register("confirmPassword", {
									required:
										"Please confirm your password",
									validate: (value) =>
										value === password ||
										"Passwords do not match",
								})}
							/>
							{errors.confirmPassword && (
								<p className="text-red-500 text-sm mt-1">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
					>
						Sign Up
					</button>
				</form>
				<p className="text-center text-sm text-gray-600 mt-4">
					Already have an account?{" "}
					<a
						href="/login"
						className="text-teal-600 hover:underline"
					>
						Log in
					</a>
				</p>
			</div>
		</div>
	);
}

export default SignupPage;
