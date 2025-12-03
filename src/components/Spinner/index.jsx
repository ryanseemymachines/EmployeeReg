import styles from "./index.module.css";

const Spinner = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;