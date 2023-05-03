import React, { useRef } from "react";
import styles from "../assets/textInput.style.css";

export default function TextInput({
  type,
  label,
  name,
  placeholder,
  onChange,
  errors,
  disabled,
  value = "",
}) {
  const ref = useRef(null);

  function clearFile() {
    onChange({ target: { id: name, value: "" } });
  }

  return (
    <div>
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      {type === "file" && !errors && typeof value === "object" ? (
        <button disabled={disabled} onClick={clearFile}>
          X remove selected file
        </button>
      ) : (
        <>
          <input
            disabled={disabled}
            onChange={onChange}
            id={name}
            type={type}
            placeholder={placeholder}
            value={type !== "file" ? value : undefined}
          />
          <div className={styles.error}>{errors && errors}</div>
        </>
      )}
    </div>
  );
}
