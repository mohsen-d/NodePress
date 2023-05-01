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
      />
    );
  }

  if (type === "checkbox") {
    return (
      <CheckBox key={name} name={name} label={label} onChange={onChange} />
    );
  }
}
