import { createSlice } from "@reduxjs/toolkit";
import {
  registerEmployeeApi,
  getEmployeeApi,
  getEmployeeByIdApi,
  deleteEmployeeApi,
  updateEmployeeApi,
} from "./api/employeeApi";

const employeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: "",
    successMessage: "",
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    getEmployeeSuccess: (state, action) => {
      state.employees = action.payload.data.list;
      state.loading = false;
      state.error = "";
    },
    getEmployeeByIdSuccess: (state, action) => {
      state.selectedEmployee = action.payload;
      state.loading = false;
      state.error = "";
    },
    registerEmployeeSuccess: (state, action) => {
      state.employees.push(action.payload);
      state.loading = false;
      state.error = "";
      state.successMessage = "Employee registered successfully!";
    },
    updateEmployeeSuccess: (state, action) => {
      const index = state.employees.findIndex(
        (emp) => emp.employeeId === action.payload.employeeId
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
      state.selectedEmployee = action.payload;
      state.loading = false;
      state.error = "";
      state.successMessage = "Employee updated successfully!";
    },
    deleteEmployeeSuccess: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.employeeId !== action.payload
      );
      state.loading = false;
      state.error = "";
      state.successMessage = "Employee deleted successfully!";
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
  getEmployeeByIdSuccess,
  updateEmployeeSuccess,
  deleteEmployeeSuccess,
  setError,
  clearError,
} = employeSlice.actions;

export const registerEmployee = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await registerEmployeeApi(form);
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

export const getEmployeeById = (employeeId) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await getEmployeeByIdApi(employeeId);
    dispatch(getEmployeeByIdSuccess(data));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export const updateEmployee = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await updateEmployeeApi(form);
    dispatch(updateEmployeeSuccess(form));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await deleteEmployeeApi(id);
    dispatch(deleteEmployeeSuccess(id));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export default employeSlice.reducer;
