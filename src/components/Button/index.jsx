import styles from "./index.module.css";

const Button = ({ type, label, onClick, btnStyle }) => {
  return (
    <button
      className={`${styles.Btn} ${btnStyle ? styles[btnStyle] : ""}`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
