import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	resetEmail: localStorage.getItem("resetEmail")
		? JSON.parse(localStorage.getItem("resetEmail"))
		: null,
};

const passwordReducer = createSlice({
	name: "password",
	initialState: initialState,
	reducers: {
		setResetEmail(state, value) {
			state.resetEmail = value.payload;
			localStorage.setItem(
				"resetEmail",
				JSON.stringify(value.payload)
			);
		},
		removeResetEmail(state) {
			state.resetEmail = null;
			localStorage.removeItem("resetEmail");
		},
	},
});

export const { setResetEmail } = passwordReducer.actions;

export default passwordReducer.reducer;
