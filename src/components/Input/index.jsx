import styles from "./index.module.css";

const Input = (props) => {
  const { 
    type, 
    name, 
    placeholder, 
    value, 
    onChange, 
    min, 
    max, 
    onClear,
  } = props;

  return (
    <div className={styles.inputWrapper}>
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

      {value && onClear && (
        <button
          className={styles.clearBtn}
          onClick={onClear}
          type="button"
          aria-label="Clear input"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Input;
