import styles from "./index.module.css";

const Input = (props) => {
  const { type, name, placeholder, value, onChange, min, max } = props;

  return (
    <input
      className={styles.textInput}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  );
};

export default Input;
