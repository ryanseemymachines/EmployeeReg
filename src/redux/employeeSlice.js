import { createSlice } from "@reduxjs/toolkit";
import {
  registerEmployeeApi,
  getEmployeeApi,
  getEmployeeByIdApi,
  deleteEmployeeApi,
  updateEmployeeApi,
} from "./api/employeeApi";
import { toast } from "react-toastify";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    selectedEmployee: null,
    loading: false,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    getEmployeeSuccess: (state, action) => {
      state.employees = action.payload.data.list;
      state.loading = false;
    },
    getEmployeeByIdSuccess: (state, action) => {
      state.selectedEmployee = action.payload;
      state.loading = false;
    },
    registerEmployeeSuccess: (state, action) => {
      state.employees.push(action.payload);
      state.loading = false;
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
    },
    deleteEmployeeSuccess: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.employeeId !== action.payload
      );
      state.loading = false;
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
} = employeeSlice.actions;

export const registerEmployee = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await registerEmployeeApi(form);
    dispatch(registerEmployeeSuccess(form));
    toast.success("Employee Registered Successfully");
    return { success: true };
  } catch (err) {
    toast.error(err.message);
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
    toast.error(err.message);
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
    toast.error(err.message);
    return { success: false };
  }
};

export const updateEmployee = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await updateEmployeeApi(form);
    dispatch(updateEmployeeSuccess(form));
    toast.success("Employee Updated Successfully");
    return { success: true };
  } catch (err) {
    toast.error(err.message);
    return { success: false };
  }
};

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await deleteEmployeeApi(id);
    dispatch(deleteEmployeeSuccess(id));
    toast.success("Employee Deleted Successfully");
    return { success: true };
  } catch (err) {
    toast.error(err.message);
    return { success: false };
  }
};

export default employeeSlice.reducer;
