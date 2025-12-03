import {
  registerEmployee,
  updateEmployee,
  clearError,
} from "../../redux/employeeSlice";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
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
  const [errors, setErrors] = useState({});

  const { error, selectedEmployee, loading, successMessage } = useSelector(
    (state) => state.employee
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      navigate("/", { replace: true });
    }
  }, [successMessage]);

  useEffect(() => {
    if (isEditMode && selectedEmployee) {
      const emp = selectedEmployee?.data?.employee;

      const data = {
        fname: emp?.fname || "",
        lname: emp?.lname || "",
        email: emp?.email || "",
        dob: emp?.dob?.split("T")[0] || "",
        doj: emp?.doj?.split("T")[0] || "",
        designation: emp?.designation || "",
        experience: emp?.experience || "",
        phoneNumber: emp?.phoneNumber || "",
      };

      setFormData(data);
      setOriginalData(data);
      setIsModified(false);
    }
  }, [isEditMode, selectedEmployee]);

  const today = new Date();
  const year18 = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const todayDate = today.toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    setIsModified(JSON.stringify(updatedData) !== JSON.stringify(originalData));
  };

  const handleClearField = (fieldName) => {
    const updatedData = { ...formData, [fieldName]: "" };
    setFormData(updatedData);

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    setIsModified(JSON.stringify(updatedData) !== JSON.stringify(originalData));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z ]+$/;

    if (!formData.fname.trim()) newErrors.fname = "Name is required";
    else if (!nameRegex.test(formData.fname))
      newErrors.fname = "Name must contain only alphabets";

    if (!formData.lname.trim()) newErrors.lname = "Name is required";
    else if (!nameRegex.test(formData.lname))
      newErrors.lname = "Name must contain only alphabets";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.doj) newErrors.doj = "Date of join is required";

    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";

    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    else if (isNaN(formData.experience))
      newErrors.experience = "Experience must be a number";
    else {
      const dojDate = new Date(formData.doj);
      let yearsDiff = today.getFullYear() - dojDate.getFullYear();

      const notCompleted =
        today.getMonth() < dojDate.getMonth() ||
        (today.getMonth() === dojDate.getMonth() &&
          today.getDate() < dojDate.getDate());

      if (notCompleted) yearsDiff--;

      const exp = parseInt(formData.experience);

      if (exp < 0) newErrors.experience = "Experience cannot be negative";
      else if (exp !== yearsDiff)
        newErrors.experience =
          "Experience must match years since date of joining";
    }

    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (isEditMode) {
      await dispatch(updateEmployee({ ...formData, employeeId: id }));
    } else {
      await dispatch(registerEmployee(formData));
    }
  };

  const buttonLabel = isEditMode ? "Edit" : "Register";
  const disableSubmit = isEditMode ? !isModified : loading;

  return (
    <div className={styles.detailContainer}>
      <Spinner isVisible={loading} />

      <div className={styles.detailContent}>
        <h1>{isEditMode ? "EDIT EMPLOYEE" : "REGISTER"}</h1>

        <form className={styles.inputForm}>
          {/* First Name */}
          <div className={styles.fieldGroup}>
            <label>First Name</label>
            <Input
              type="text"
              name="fname"
              value={formData.fname}
              placeholder="Enter first name..."
              onChange={handleChange}
              onClear={() => handleClearField("fname")}
            />
            <p className={styles.errorMsg}>{errors.fname || "\u00A0"}</p>
          </div>

          {/* Last Name */}
          <div className={styles.fieldGroup}>
            <label>Last Name</label>
            <Input
            type="text"
              name="lname"
              value={formData.lname}
              placeholder="Enter last name..."
              onChange={handleChange}
              onClear={() => handleClearField("lname")}
            />
            <p className={styles.errorMsg}>{errors.lname || "\u00A0"}</p>
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <label>Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter email..."
              onChange={handleChange}
              onClear={() => handleClearField("email")}
            />
            <p className={styles.errorMsg}>{errors.email || "\u00A0"}</p>
          </div>

          {/* DOB & DOJ */}
          <div className={styles.dateRow}>
            <div className={styles.fieldGroup}>
              <label>Date of Birth</label>
              <Input
                name="dob"
                type="date"
                max={year18}
                value={formData.dob}
                onChange={handleChange}
              />
              <p className={styles.errorMsg}>{errors.dob || "\u00A0"}</p>
            </div>

            <div className={styles.fieldGroup}>
              <label>Date of Join</label>
              <Input
                name="doj"
                type="date"
                max={todayDate}
                value={formData.doj}
                onChange={handleChange}
              />
              <p className={styles.errorMsg}>{errors.doj || "\u00A0"}</p>
            </div>
          </div>

          {/* Designation */}
          <div className={styles.fieldGroup}>
            <label>Designation</label>
            <Input
            type="text"
              name="designation"
              value={formData.designation}
              placeholder="Enter designation..."
              onChange={handleChange}
              onClear={() => handleClearField("designation")}
            />
            <p className={styles.errorMsg}>{errors.designation || "\u00A0"}</p>
          </div>

          {/* Experience + Phone */}
          <div className={styles.phoneRow}>
            <div className={styles.fieldGroup}>
              <label>Experience (in Yrs)</label>
              <Input
                name="experience"
                type="number"
                value={formData.experience}
                placeholder="Enter experience..."
                onChange={handleChange}
                onClear={() => handleClearField("experience")}
              />
              <p className={styles.errorMsg}>{errors.experience || "\u00A0"}</p>
            </div>

            <div className={styles.fieldGroup}>
              <label>Phone</label>
              <Input
                name="phoneNumber"
                type="number"
                value={formData.phoneNumber}
                placeholder="Enter phone..."
                onChange={handleChange}
                onClear={() => handleClearField("phoneNumber")}
              />
              <p className={styles.errorMsg}>
                {errors.phoneNumber || "\u00A0"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.btnRow}>
            <Button
              btnStyle={isEditMode ? "editBtn" : "regBtn"}
              type="button"
              label={buttonLabel}
              onClick={handleSubmit}
              disabled={disableSubmit}
            />

            <Button
              btnStyle="regBtn"
              type="button"
              label="Cancel"
              onClick={() => navigate("/", { replace: true })}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAddEdit;
