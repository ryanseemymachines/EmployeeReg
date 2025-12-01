import { createSlice } from "@reduxjs/toolkit";
import {
  registerEmployeeApi,
  getEmployeeApi,
  deleteEmployeeApi,
} from "./api/employeeApi";

const employeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: "",
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    getEmployeeSuccess: (state, action) => {
      state.employees = action.payload.data.list;
      console.log(state.employees);
      state.loading = false;
      state.error = "";
    },
    registerEmployeeSuccess: (state, action) => {
      state.employees.push(action.payload);
      state.loading = false;
      state.error = "";
    },
    deleteEmployeeSuccess: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.employeeId !== action.payload
      );
      state.loading = false;
      state.error = "";
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
});

export const {
  startLoading,
  registerEmployeeSuccess,
  getEmployeeSuccess,
  setError,
  clearError,
} = employeSlice.actions;

export const registerEmployee = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await registerEmployeeApi(form);
    dispatch(registerEmployeeSuccess(form));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export const getEmployee = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await getEmployeeApi();
    dispatch(getEmployeeSuccess(data));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await deleteEmployeeApi(id);
    dispatch(deleteEmployeeSuccess(data));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export default employeSlice.reducer;
