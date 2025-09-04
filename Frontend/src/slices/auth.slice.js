import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user"))
		: null,
	token: localStorage.getItem("token")
		? JSON.parse(localStorage.getItem("token"))
		: null,
	loading: false,
};

const authReducer = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setToken(state, value) {
			state.token = value.payload;
			localStorage.setItem("token", JSON.stringify(value.payload));
		},
		setUser(state, value) {
			state.user = value.payload;
			localStorage.setItem("user", JSON.stringify(value.payload));
		},
		setLoading(state, value) {
			state.loading = value.payload;
		},
	},
});

export const { setToken, setUser, setLoading } = authReducer.actions;
export default authReducer.reducer;
