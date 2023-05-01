import React from "react";

export default function Checkbox({ label, name, onChange }) {
  return (
    <div>
      <input onChange={onChange} id={name} type="checkbox" />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}
