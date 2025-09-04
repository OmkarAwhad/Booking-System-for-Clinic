const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = {
	SIGNUP_URL: BASE_URL + "/auth/signup",
	LOGIN_URL: BASE_URL + "/auth/login",
	FORGOT_PASSWORD: BASE_URL + "/auth/forgetPassword",
	VERIFY_OTP: BASE_URL + "/auth/verifyOTP",
	CHANGE_PASSWORD: BASE_URL + "/auth/changePassword",
};
