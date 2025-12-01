import { logout } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./index.module.css";

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/users/login", { replace: true });
  };
  return (
    <header>
      <div className={styles.headerTop}>
        <h3>Employee Dashboard</h3>
        <div className={styles.headerBtns}>
          <Button
            btnStyle="headerBtn"
            type="button"
            label="Add Employee"
            onClick={() => navigate("/employee/signup")}
          />
          <Button
            btnStyle="headerBtn"
            type="button"
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>

      <h1>Welcome to Employee Dashboard</h1>
    </header>
  );
};

export default Header;
