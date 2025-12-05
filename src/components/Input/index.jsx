import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./index.module.css";

const Input = (props) => {
  const {
    type,
    name,
    maxLength,
    placeholder,
    value,
    onChange,
    min,
    max,
    onClear,
    inputStyle,
    onWheel,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.textInput} ${
          inputStyle ? styles[inputStyle] : ""
        }`}
        type={inputType}
        name={name}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        onWheel={onWheel}
      />

      {value && onClear && (
        <>
          <MdOutlineCancel className={styles.clearBtn} onClick={onClear} />
          {isPassword &&
            (showPassword ? (
              <AiOutlineEyeInvisible
                className={styles.passwordToggleBtn}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <AiOutlineEye
                className={styles.passwordToggleBtn}
                onClick={() => setShowPassword(true)}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default Input;
