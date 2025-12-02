import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import employeeReducer from "./employeeSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
  },
});

export default store;
