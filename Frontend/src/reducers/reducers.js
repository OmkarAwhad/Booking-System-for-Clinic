import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import passwordReducer from "../slices/password.slice";

const rootReducers = combineReducers({
	auth: authReducer,
	password: passwordReducer,
});

export default rootReducers;
