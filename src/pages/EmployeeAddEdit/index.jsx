import {
  registerEmployee,
  updateEmployee,
  clearError,
} from "../../redux/employeeSlice";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    setErrors((prev) => ({ ...prev, [name]: "" }));

    const changed =
      JSON.stringify(updatedData) !== JSON.stringify(originalData);

    setIsModified(changed);

    if (error) dispatch(clearError());
  };

  const handleClearField = (fieldName) => {
    const updatedData = { ...formData, [fieldName]: "" };
    setFormData(updatedData);

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

    const changed =
      JSON.stringify(updatedData) !== JSON.stringify(originalData);
    setIsModified(changed);
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

    if (formData.doj && formData.experience !== "") {
      const dojDate = new Date(formData.doj);
      const today = new Date();
      const experience = parseInt(formData.experience);

      let yearsDiff = today.getFullYear() - dojDate.getFullYear();

      const hasNotHadAnniversary =
        today.getMonth() < dojDate.getMonth() ||
        (today.getMonth() === dojDate.getMonth() &&
          today.getDate() < dojDate.getDate());

      if (hasNotHadAnniversary) {
        yearsDiff -= 1;
      }

      if (experience < 0) {
        newErrors.experience = "Experience cannot be negative";
      } else if (experience > yearsDiff) {
        newErrors.experience =
          "Experience cannot be more than years since date of joining";
      } else if (experience < yearsDiff) {
        newErrors.experience =
          "Experience cannot be less than years since date of joining";
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

  const buttonLabel = isEditMode ? "Edit" : "Register";
  const pageTitle = isEditMode ? "EDIT EMPLOYEE" : "REGISTER";
  const disableSubmit = isEditMode ? !isModified : isSubmitting;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        <h1>{pageTitle}</h1>

        <form className={styles.inputForm}>
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Email */}
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

          {/* Dates */}
          <div className={styles.dateRow}>
            <div className={styles.fieldGroup}>
              <label>Date of Birth</label>
              <Input
                type="date"
                name="dob"
                max={year18}
                value={formData.dob}
                onChange={handleChange}
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
                max={todayDate}
                value={formData.doj}
                onChange={handleChange}
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

          {/* Designation */}
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

          {/* Experience + Phone */}
          <div className={styles.phoneRow}>
            <div className={styles.fieldGroup}>
              <label>Experience (in Yrs)</label>
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

          {/* Buttons */}
          <div className={styles.btnRow}>
            <Button
              btnStyle="regBtn"
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

        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
    </div>
  );
};

export default EmployeeAddEdit;
