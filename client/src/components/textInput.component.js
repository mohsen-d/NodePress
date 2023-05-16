import React, { useRef } from "react";

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

  const inptuClasses = `form-control${errors ? " is-invalid" : ""}`;

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      {type === "file" && !errors && typeof value === "object" ? (
        <div class="d-grid">
          <button
            className="btn btn-outline-success"
            disabled={disabled}
            onClick={clearFile}
          >
            X remove selected file
          </button>
        </div>
      ) : (
        <>
          <input
            disabled={disabled}
            onChange={onChange}
            id={name}
            type={type}
            placeholder={placeholder}
            value={type !== "file" ? value : undefined}
            className={inptuClasses}
          />
          <div className="invalid-feedback">{errors && errors}</div>
        </>
      )}
    </div>
  );
}
