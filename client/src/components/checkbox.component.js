import React from "react";

export default function Checkbox({
  label,
  name,
  onChange,
  disabled,
  value = false,
  tabIndex = 0,
}) {
  return (
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        disabled={disabled}
        onChange={onChange}
        id={name}
        type="checkbox"
        checked={value}
        tabIndex={tabIndex}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
}
