import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./index.module.css";
import { useState } from "react";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        <div className={styles.authContentLeft}>
          <h2>INFORMATION</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            corporis fuga aspernatur qui, fugiat quam sunt totam in cupiditate
            corrupti assumenda nisi, dolorum eius laudantium veritatis.
            Provident enim odio deleniti!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
            nisi corporis consequatur cumque ad tempora eaque.
          </p>

          <Button
            btnStyle="loginSwitchBtn"
            type="button"
            label={isLogin ? "New Here? Register Now!" : "Have an account?"}
            onClick={() => {
              const nextState = !isLogin;
              setIsLogin(nextState);
              navigate(nextState ? "/users/login" : "/users/signup", { replace: true });
            }}
          />
        </div>

        <div className={styles.authContentRight}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Auth;
