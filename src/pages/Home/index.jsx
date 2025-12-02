import Header from "../Header";
import Employeelist from "../EmployeeList";
import styles from "./index.module.css";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Header />
      <Employeelist />
    </div>
  );
};

export default Home;
