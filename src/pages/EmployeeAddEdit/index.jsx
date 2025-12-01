import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmployee,clearError } from "../../redux/employeeSlice";
import { useDispatch,useSelector } from "react-redux";
import Input from "../../components/Input";
import Button from "../../components/Button";
import styles from "./index.module.css";

const EmployeeAddEdit = () => {
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

  const { error } = useSelector((state) => state.employee);
  const dispatch=useDispatch();
  const navigate=useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (error) dispatch(clearError());
  };

  const handleClearField = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const result = await dispatch(registerEmployee(formData));

    if(result.success){
      navigate("/" , {replace:true})
    }
      
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        <h1>REGISTER</h1>

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
                type="text"
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
              label="Register"
              onClick={handleSubmit}
            />
            <Button
              btnStyle="regBtn"
              type="button"
              label="Cancel"
              onClick={() => navigate("/" , {replace:true})}
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
