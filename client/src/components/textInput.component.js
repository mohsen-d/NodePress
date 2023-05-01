import React from "react";
import styles from "../assets/textInput.style.css";

export default function TextInput({
  type,
  label,
  name,
  placeholder,
  onChange,
  errors,
}) {
  return (
    <div>
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      <input
        onChange={onChange}
        id={name}
        type={type}
        placeholder={placeholder}
      />
      <div className={styles.error}>{errors && errors}</div>
    </div>
  );
}
