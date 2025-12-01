import styles from "./index.module.css";

const Button = ({ type, label, onClick, btnStyle, disabled }) => {
  return (
    <button
      className={`${styles.Btn} ${btnStyle ? styles[btnStyle] : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
