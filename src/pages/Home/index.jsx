import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Employeelist from "../EmployeeList";
import styles from "./index.module.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/users/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp < Math.floor(Date.now() / 1000);

      if (isExpired) {
        localStorage.removeItem("token");
        navigate("/users/login"); 
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/users/login"); 
    }
  }, [navigate]);

  return (
    <div className={styles.homeContainer}>
      <Header />
      <Employeelist />
    </div>
  );
};

export default Home;
