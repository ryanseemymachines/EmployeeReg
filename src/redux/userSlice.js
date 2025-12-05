import { createSlice } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../redux/api/userApi";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("token") || "",
    loading: false,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      const rawToken = action.payload.replace("Bearer ", "");
      state.token = rawToken;
      localStorage.setItem("token", rawToken);
      state.loading = false;
    },
    loginFailure: (state) => {
      state.token = "";
      state.loading = false;
      localStorage.removeItem("token");
    },
    registerSuccess: (state) => {
      state.loading = false;
    },
    registerFailure: (state) => {
      state.token = "";
      state.loading = false;
      localStorage.removeItem("token");
    },
    logout: (state) => {
      state.token = "";
      state.loading = false;
      localStorage.removeItem("token");
    },
  },
});

export const {
  startLoading,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logout,
} = userSlice.actions;

export const loginUser = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await loginApi(form);
    dispatch(loginSuccess(data.data.token));
    toast.success("Login Successful");
    return { success: true };
  } catch (err) {
    dispatch(loginFailure());
    toast.error(err.message);
    return { success: false };
  }
};

export const registerUser = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await registerApi(form);
    dispatch(registerSuccess());
    toast.success("Registration Successful");
    return { success: true };
  } catch (err) {
    dispatch(registerFailure());
    toast.error(err.message);
    return { success: false };
  }
};

export default userSlice.reducer;
