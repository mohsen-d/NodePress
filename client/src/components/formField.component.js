import React from "react";

import TextInput from "./textInput.component";
import CheckBox from "./checkbox.component";

export default function FormField({
  type,
  label,
  name,
  placeholder,
  onChange,
  errors = undefined,
  disabled,
  value = undefined,
  tabIndex,
}) {
  if (["text", "file", "email", "password"].includes(type)) {
    return (
      <TextInput
        key={name}
        name={name}
        label={label}
        placeholder={placeholder}
        type={type}
        errors={errors}
        onChange={onChange}
        disabled={disabled}
        value={value}
        tabIndex={tabIndex}
      />
    );
  }

  if (type === "checkbox") {
    return (
      <CheckBox
        disabled={disabled}
        key={name}
        name={name}
        label={label}
        onChange={onChange}
        value={value}
        tabIndex={tabIndex}
      />
    );
  }
}
