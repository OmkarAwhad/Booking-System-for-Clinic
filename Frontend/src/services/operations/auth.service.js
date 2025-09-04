import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { authApi } from "../apis.service";
import { setLoading } from "../../slices/auth.slice";

export function signup(data, navigate) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading ....");
		dispatch(setLoading(true));
		try {
			const response = await apiConnector(
				"POST",
				authApi.SIGNUP_URL,
				data
			);
			if (!response.data.success) {
				toast.error("Error in signing up");
				return false;
			}

			return response.data.data;
		} catch (error) {
			console.log("Registration failed");
			toast.error("Registration failed");
			navigate("/signup");
		}
		dispatch(setLoading(false));
		toast.remove(toastId);
	};
}

export function login(data, navigate) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading ...");
		dispatch(setLoading(true));
		try {
			const response = await apiConnector(
				"POST",
				authApi.LOGIN_URL,
				data
			);
			if (!response.data.success) {
				toast.error("Error in logging in");
				return false;
			}

			return response.data.data;
		} catch (error) {
			console.log("Login failed");
			toast.error("Login failed");
			navigate("/login");
		}
		dispatch(setLoading(false));
		toast.remove(toastId);
	};
}

export function forgotPassword(email) {
	return async (dispatch) => {
		const toastId = toast.loading("Sending OTP...");
		try {
			const response = await apiConnector(
				"POST",
				authApi.FORGOT_PASSWORD,
				{ email }
			);
			if (!response.data.success) {
				toast.error(response.data.message || "Failed to send OTP");
				return false;
			}
			toast.success("OTP sent to your email");
			return response.data;
		} catch (error) {
			console.error("Error in forgetPassword:", error);
			toast.error("Error in sending OTP");
			return false;
		} finally {
			toast.remove(toastId);
		}
	};
}

export function verifyOTP(email, otp) {
	return async (dispatch) => {
		const toastId = toast.loading("Verifying OTP...");
		try {
			const response = await apiConnector("POST", authApi.VERIFY_OTP, {
				email,
				otp,
			});
			if (!response.data.success) {
				toast.error(
					response.data.message || "OTP verification failed"
				);
				return false;
			}
			toast.success("OTP verified");
			return response.data;
		} catch (error) {
			console.error("Error in verifyOTP:", error);
			toast.error("Error in verifying OTP");
			return false;
		} finally {
			toast.remove(toastId);
		}
	};
}

export function changePassword(token, newPassword, confirmPassword) {
	return async (dispatch) => {
		const toastId = toast.loading("Changing password...");
		try {
			const response = await apiConnector(
				"POST",
				authApi.CHANGE_PASSWORD,
				{ token, newPassword, confirmPassword }
			);
			if (!response.data.success) {
				toast.error(
					response.data.message || "Password change failed"
				);
				return false;
			}
			toast.success("Password changed successfully");
			return response.data;
		} catch (error) {
			console.error("Error in changePassword:", error);
			toast.error("Error in changing password");
			return false;
		} finally {
			toast.remove(toastId);
		}
	};
}
