import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import SpinnerLazy from "../../components/SpinnerLazy";
import Header from "../Header";
import styles from "./index.module.css";

const Employeelist = lazy(() => import("../EmployeeList"));
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp < Math.floor(Date.now() / 1000);

      if (isExpired) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={styles.homeContainer}>
      <Header />
      <Suspense fallback={<SpinnerLazy />}>
        <Employeelist />
      </Suspense>
    </div>
  );
};

export default Home;
