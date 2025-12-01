import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.user);

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

    const result = await dispatch(loginUser(formData));

    if (result.success) {
      setLoginSuccess(true);
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, navigate]);

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
          onClear={() => handleClearField("email")}
        />
        {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
      </div>

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

      {error && <p className={styles.errorMsg}>{error}</p>}

      <Button
        btnStyle="regBtn"
        type="button"
        label={
          loginSuccess ? "Logging in..." : loading ? "Logging in..." : "Login"
        }
        onClick={handleSubmit}
        disabled={loading || loginSuccess}
      />
    </>
  );
};

export default Login;
