import { loginUser } from "../../../redux/userSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import styles from "./index.module.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (result.success) navigate("/", { replace: true });
    else navigate("/login");
  };

  return (
    <>
      <h2>LOGIN</h2>

      <div className={styles.inputArea}>
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
          <p
            className={`${styles.errorMsg} ${
              errors.email ? styles.visible : ""
            }`}
          >
            {errors.email}
          </p>
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
          <p
            className={`${styles.errorMsg} ${
              errors.password ? styles.visible : ""
            }`}
          >
            {errors.password}
          </p>
        </div>
      </div>

      <Button
        btnStyle="regBtn"
        type="button"
        label={loading ? "Logging in..." : "Login"}
        onClick={handleSubmit}
        disabled={loading}
      />
    </>
  );
};

export default Login;
