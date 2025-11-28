import { createSlice } from "@reduxjs/toolkit";
import { loginApi , registerApi } from "../api/userApi";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("token") || "",
    loading: false,
    error: "",
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    loginSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      console.log(action.payload);
      state.loading = false;
      state.error = "";
    },
    registerSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      state.loading = false;
      state.error = "";
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { startLoading, loginSuccess, registerSuccess, setError, logout } =
  userSlice.actions;

export const loginUser = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await loginApi(form);
    dispatch(loginSuccess(data.data.token));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export const registerUser = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await registerApi(form);
    dispatch(registerSuccess(data.data.token));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export default userSlice.reducer;
