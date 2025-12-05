import styles from "./index.module.css";

const SpinnerLazy = () => {
  return (
    <div className={styles.lazyWrapper}>
      <div className={styles.lazySpinner}></div>
    </div>
  );
};

export default SpinnerLazy;