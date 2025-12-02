import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerEmployee, updateEmployee, clearError } from "../../redux/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Input";
import Button from "../../components/Button";
import styles from "./index.module.css";

const EmployeeAddEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    dob: "",
    doj: "",
    designation: "",
    experience: "",
    phoneNumber: "",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isModified, setIsModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { error, selectedEmployee } = useSelector((state) => state.employee);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const today = new Date();
  const year18 = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const todayDate = new Date().toISOString().split("T")[0];

  const [errors, setErrors] = useState({});

  // Load employee data if in edit mode
  useEffect(() => {
    if (isEditMode && selectedEmployee) {
      const data = {
        fname: selectedEmployee.fname || "",
        lname: selectedEmployee.lname || "",
        email: selectedEmployee.email || "",
        dob: selectedEmployee.dob?.split("T")[0] || "",
        doj: selectedEmployee.doj?.split("T")[0] || "",
        designation: selectedEmployee.designation || "",
        experience: selectedEmployee.experience || "",
        phoneNumber: selectedEmployee.phoneNumber || "",
      };
      setFormData(data);
      setOriginalData(data);
      setIsModified(false);
    }
  }, [isEditMode, selectedEmployee, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Check if form is modified
    const isChanged = JSON.stringify(updatedData) !== JSON.stringify(originalData);
    setIsModified(isChanged);

    if (error) dispatch(clearError());
  };

  const handleClearField = (fieldName) => {
    const updatedData = { ...formData, [fieldName]: "" };
    setFormData(updatedData);
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

    const isChanged = JSON.stringify(updatedData) !== JSON.stringify(originalData);
    setIsModified(isChanged);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fname.trim()) {
      newErrors.fname = "Name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.fname)) {
      newErrors.fname = "Name must contain only alphabets";
    }

    if (!formData.lname.trim()) {
      newErrors.lname = "Name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.lname)) {
      newErrors.lname = "Name must contain only alphabets";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.doj) newErrors.doj = "Date of join is required";

    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    } else if (isNaN(formData.experience)) {
      newErrors.experience = "Experience must be a number";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    // Validate date of joining and experience match
    if (formData.doj && formData.experience) {
      const dojDate = new Date(formData.doj);
      const today = new Date();
      const yearsCalculated = today.getFullYear() - dojDate.getFullYear();
      const monthDiff = today.getMonth() - dojDate.getMonth();
      const adjustedYears = monthDiff < 0 ? yearsCalculated - 1 : yearsCalculated;

      const experienceYears = parseInt(formData.experience);
      if (experienceYears > adjustedYears) {
        newErrors.experience =
          "Experience cannot be more than years since date of joining";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    let result;

    if (isEditMode) {
      result = await dispatch(updateEmployee({ ...formData, employeeId: id }));
    } else {
      result = await dispatch(registerEmployee(formData));
    }

    if (result.success) {
      navigate("/", { replace: true });
    }
    setIsSubmitting(false);
  };

  const buttonLabel = isEditMode ? "Update" : "Register";
  const pageTitle = isEditMode ? "EDIT EMPLOYEE" : "REGISTER";
  const submitButtonDisabled = isEditMode ? !isModified : isSubmitting;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        <h1>{pageTitle}</h1>

        <form className={styles.inputForm}>
          {/* FIRST NAME */}
          <div className={styles.fieldGroup}>
            <label>First Name</label>
            <Input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Enter first name..."
              onClear={() => handleClearField("fname")}
            />
            <p
              className={`${styles.errorMsg} ${
                errors.fname ? styles.visible : ""
              }`}
            >
              {errors.fname || "\u00A0"}
            </p>
          </div>

          {/* LAST NAME */}
          <div className={styles.fieldGroup}>
            <label>Last Name</label>
            <Input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Enter last name..."
              onClear={() => handleClearField("lname")}
            />
            <p
              className={`${styles.errorMsg} ${
                errors.lname ? styles.visible : ""
              }`}
            >
              {errors.lname || "\u00A0"}
            </p>
          </div>

          {/* EMAIL */}
          <div className={styles.fieldGroup}>
            <label>Email address</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              onClear={() => handleClearField("email")}
            />
            <p
              className={`${styles.errorMsg} ${
                errors.email ? styles.visible : ""
              }`}
            >
              {errors.email || "\u00A0"}
            </p>
          </div>

          {/* DATES */}
          <div className={styles.dateRow}>
            <div className={styles.fieldGroup}>
              <label>Date of Birth</label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={year18}
              />

              <p
                className={`${styles.errorMsg} ${
                  errors.dob ? styles.visible : ""
                }`}
              >
                {errors.dob || "\u00A0"}
              </p>
            </div>

            <div className={styles.fieldGroup}>
              <label>Date of Join</label>
              <Input
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
                max={todayDate}
              />

              <p
                className={`${styles.errorMsg} ${
                  errors.doj ? styles.visible : ""
                }`}
              >
                {errors.doj || "\u00A0"}
              </p>
            </div>
          </div>

          {/* DESIGNATION */}
          <div className={styles.fieldGroup}>
            <label>Designation</label>
            <Input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation..."
              onClear={() => handleClearField("designation")}
            />
            <p
              className={`${styles.errorMsg} ${
                errors.designation ? styles.visible : ""
              }`}
            >
              {errors.designation || "\u00A0"}
            </p>
          </div>

          {/* EXPERIENCE + PHONE */}
          <div className={styles.phoneRow}>
            <div className={styles.fieldGroup}>
              <label>Experience(in Yrs)</label>
              <Input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter experience..."
                onClear={() => handleClearField("experience")}
              />
              <p
                className={`${styles.errorMsg} ${
                  errors.experience ? styles.visible : ""
                }`}
              >
                {errors.experience || "\u00A0"}
              </p>
            </div>

            <div className={styles.fieldGroup}>
              <label>Phone</label>
              <Input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone..."
                onClear={() => handleClearField("phoneNumber")}
              />
              <p
                className={`${styles.errorMsg} ${
                  errors.phoneNumber ? styles.visible : ""
                }`}
              >
                {errors.phoneNumber || "\u00A0"}
              </p>
            </div>
          </div>

          <div className={styles.btnRow}>
            <Button
              btnStyle="regBtn"
              type="button"
              label={buttonLabel}
              onClick={handleSubmit}
              disabled={submitButtonDisabled}
            />
            <Button
              btnStyle="regBtn"
              type="button"
              label="Cancel"
              onClick={() => navigate("/", { replace: true })}
            />
          </div>
        </form>

        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
      <p>Click cancel to go back Home</p>
    </div>
  );
};

export default EmployeeAddEdit;


import { getEmployee, deleteEmployee, setSelectedEmployee } from "../../redux/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

const Employeelist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getEmployee());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleEdit = (employee) => {
    dispatch(setSelectedEmployee(employee));
    navigate(`/employee/edit/${employee.employeeId}`);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteEmployee(id));
    dispatch(getEmployee());
  };

  const employeeList = employees || [];

  return (
    <div className={styles.container}>
      {employeeList.length > 0 ? (
        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Date of Join</th>
              <th>Experience (yrs)</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employeeList.map((emp) => (
              <tr key={emp.employeeId}>
                <td>
                  {emp.fname} {emp.lname}
                </td>
                <td>{emp.designation}</td>
                <td>{formatDate(emp.doj)}</td>
                <td>{emp.experience}</td>
                <td>{emp.email}</td>
                <td>{formatDate(emp.dob)}</td>
                <td>{emp.phoneNumber}</td>
                <td>
                  <ul className={styles.actionBtns}>
                    <li onClick={() => handleEdit(emp)}>
                      Edit
                    </li>
                    <li onClick={() => handleDelete(emp.employeeId)}>Delete</li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found</p>
      )}
    </div>
  );
};

export default Employeelist;

const BASE_URL = "http://localhost:8000/api";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const message = data.message || "Something went wrong";
    throw new Error(message);
  }
  return data;
};

export const getEmployeeApi = async () => {
  return fetch(`${BASE_URL}/employee/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then(handleResponse);
};

export const registerEmployeeApi = async (employeeData) => {
  return fetch(`${BASE_URL}/employee/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(employeeData),
  }).then(handleResponse);
};

export const updateEmployeeApi = async (employeeData) => {
  return fetch(`${BASE_URL}/employee/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(employeeData),
  }).then(handleResponse);
};

export const deleteEmployeeApi = async (employeeId) => {
  return fetch(`${BASE_URL}/employee/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ employeeId }),
  }).then(handleResponse);
};

import { createSlice } from "@reduxjs/toolkit";
import {
  registerEmployeeApi,
  getEmployeeApi,
  deleteEmployeeApi,
  updateEmployeeApi,
} from "./api/employeeApi";

const employeeSlice = createSlice({
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
      console.log(state.employees);
      state.loading = false;
      state.error = "";
    },
    registerEmployeeSuccess: (state, action) => {
      state.employees.push(action.payload);
      state.loading = false;
      state.error = "";
      state.successMessage = "Employee registered successfully";
    },
    updateEmployeeSuccess: (state, action) => {
      const index = state.employees.findIndex(
        (emp) => emp.employeeId === action.payload.employeeId
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
      state.loading = false;
      state.error = "";
      state.successMessage = "Employee updated successfully";
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
    clearSuccessMessage: (state) => {
      state.successMessage = "";
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
  },
});

export const {
  startLoading,
  registerEmployeeSuccess,
  getEmployeeSuccess,
  updateEmployeeSuccess,
  setError,
  clearError,
  clearSuccessMessage,
  setSelectedEmployee,
} = employeeSlice.actions;

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

export const updateEmployee = (form) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await updateEmployeeApi(form);
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
    const data = await deleteEmployeeApi(id);
    dispatch(deleteEmployeeSuccess(id));
    return { success: true };
  } catch (err) {
    dispatch(setError(err.message));
    return { success: false };
  }
};

export default employeeSlice.reducer;

import { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toast}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 16px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-weight: 500;
  z-index: 9999;
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSuccessMessage } from "../../redux/employeeSlice";
import Employeelist from "../EmployeeList";
import Toast from "../../components/Toast";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css"; // Adjust based on your actual path

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { successMessage } = useSelector((state) => state.employee);

  const handleAddEmployee = () => {
    navigate("/employee/add");
  };

  const handleCloseToast = () => {
    dispatch(clearSuccessMessage());
  };

  return (
    <div className={styles.homeContainer}>
      <Toast message={successMessage} onClose={handleCloseToast} />
      
      <div className={styles.header}>
        <h1>Employee Management System</h1>
        <Button
          btnStyle="addBtn"
          type="button"
          label="Add Employee"
          onClick={handleAddEmployee}
        />
      </div>

      <Employeelist />
    </div>
  );
};

export default Home;