import { useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userSlice";
import { useNavigate, Navigate } from "react-router-dom";
import { isLoggedIn } from "../../../auth";
import styles from "./index.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
    if (name === "confirmPassword") setConfirmPasswordError("");
  };

  const validate = () => {
    let valid = true;

    if (!formData.email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Enter a valid email");
      valid = false;
    }

    if (!formData.password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (!formData.confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await dispatch(registerUser(formData));

    if (result.success) {
      navigate("/users/login", { replace: true });
    }
  };

  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <h2>REGISTER</h2>

      <div className={styles.fieldGroup}>
        <label>Your email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
        />
        {emailError && <p className={styles.errorMsg}>{emailError}</p>}
      </div>

      <div className={styles.passwordRow}>
        <div className={styles.fieldGroup}>
          <label>Password</label>
          <Input
            name="password"
            type="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          {passwordError && <p className={styles.errorMsg}>{passwordError}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label>Confirm Password</label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          {confirmPasswordError && (
            <p className={styles.errorMsg}>{confirmPasswordError}</p>
          )}
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

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
