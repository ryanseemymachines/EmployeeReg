import { useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/userSlice";
import { useNavigate, Navigate } from "react-router-dom";
import { isLoggedIn } from "../../../auth";
import styles from "./index.module.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
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
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await dispatch(loginUser(formData));

    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
      <h2>LOGIN</h2>

      <div className={styles.fieldGroup}>
        <label>Your email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {emailError && <p className={styles.errorMsg}>{emailError}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label>Password</label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {passwordError && <p className={styles.errorMsg}>{passwordError}</p>}
      </div>

      {/* API ERROR */}
      {error && <p className={styles.errorMsg}>{error}</p>}

      <Button
        btnStyle="regBtn"
        type="button"
        label={loading ? "Logging in..." : "Login"}
        onClick={handleSubmit}
      />
    </>
  );
};

export default Login;
