import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OpenRoute from "./components/auth/OpenRoute";
import ForgetPassword from "./components/auth/ForgetPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import ChangePassword from "./components/auth/ChangePassword";

function App() {
	return (
		<div className="h-screen w-full bg-white playfair-display-logo">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/login"
					element={
						<OpenRoute>
							<LoginPage />
						</OpenRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<OpenRoute>
							<SignupPage />
						</OpenRoute>
					}
				/>
				<Route
					path="/forgot-password"
					element={
						<OpenRoute>
							<ForgetPassword />
						</OpenRoute>
					}
				/><Route
					path="/verify-otp"
					element={
						<OpenRoute>
							<VerifyOTP />
						</OpenRoute>
					}
				/><Route
					path="/change-password"
					element={
						<OpenRoute>
							<ChangePassword />
						</OpenRoute>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
