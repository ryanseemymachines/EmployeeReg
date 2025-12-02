import {
  registerUser,
  clearError,
  clearSuccess,
} from "../../../redux/userSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import styles from "./index.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const { loading, error, successMessage } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearSuccess());
    }
  }, [successMessage]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (error) dispatch(clearError());
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearField = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await dispatch(registerUser(formData));

    if (result.success) {
      navigate("/users/login", { replace: true });
    }
  };

  return (
    <>
      <h2>REGISTER</h2>

      <div className={styles.fieldGroup}>
        <label>Your email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          onClear={() => handleClearField("email")}
        />
        {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
      </div>

      <div className={styles.passwordRow}>
        <div className={styles.fieldGroup}>
          <label>Password</label>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            onClear={() => handleClearField("password")}
          />
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label>Confirm Password</label>
          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            onClear={() => handleClearField("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className={styles.errorMsg}>{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <Button
        btnStyle="regBtn"
        type="button"
        label={loading ? "Registering..." : "Register"}
        onClick={handleSubmit}
      />
    </>
  );
};

export default Register;
