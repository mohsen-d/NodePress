import React from "react";

export default function Checkbox({
  label,
  name,
  onChange,
  disabled,
  value = false,
}) {
  return (
    <div>
      <input
        disabled={disabled}
        onChange={onChange}
        id={name}
        type="checkbox"
        checked={value}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}
