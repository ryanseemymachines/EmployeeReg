import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import styles from "./index.module.css";

const Auth = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        <div className={styles.authContentLeft}>
          <h2>INFORMATION</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi ullam
            nemo obcaecati, iste veniam voluptates vel dolores adipisci! Quia
            tempora itaque quam ex, id suscipit esse consectetur necessitatibus
            neque delectus!
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi ullam
            nemo obcaecati, iste veniam voluptates vel dolores adipisci!
          </p>

          <Button
            btnStyle="loginSwitchBtn"
            type="button"
            label={isLogin ? "New Here? Register Now!" : "Have an account?"}
            onClick={() => setIsLogin(!isLogin)}
          />
        </div>

        <div className={styles.authContentRight}>
          <h2>{isLogin ? "LOGIN" : "REGISTER"}</h2>

          <div className={styles.fieldGroup}>
            <label>Your email</label>
            <Input type="text" placeholder="Enter email" />
            {emailError && <p className={styles.errorMsg}>{emailError}</p>}
          </div>

          <div className={styles.passwordRow}>
            <div className={styles.fieldGroup}>
              <label>Password</label>
              <Input type="password" placeholder="Password" />
              {passwordError && (
                <p className={styles.errorMsg}>{passwordError}</p>
              )}
            </div>

            {!isLogin && (
              <div className={styles.fieldGroup}>
                <label>Confirm password</label>
                <Input type="password" placeholder="Confirm password" />
                {confirmPasswordError && (
                  <p className={styles.errorMsg}>{confirmPasswordError}</p>
                )}
              </div>
            )}
          </div>

          <Button
            btnStyle="regBtn"
            type="button"
            label={isLogin ? "Login" : "Register"}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;


// https://medium.com/@yogeshmulecraft/implementing-protected-routes-in-react-js-b39583be0740