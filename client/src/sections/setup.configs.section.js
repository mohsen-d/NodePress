import React, { useState } from "react";

import FormField from "../components/formField.component";
import SubmitButton from "../components/submitButton.component";
import { fields, validate, validateField } from "../models/configs.model";
import { getUndefinedConfigs, saveConfigs } from "../services/setup.services";

export default ({ stepCompleted, data }) => {
  const [form, setForm] = useState(data);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});

  const undefinedFields = getUndefinedConfigs(fields);

  function handleChange(e) {
    const error = validateField(e.target.id, e.target.value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [e.target.id]: error ? error[e.target.id] : undefined,
    }));

    setForm((currentForm) => ({
      ...currentForm,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit() {
    const formEerrors = validate(form);

    if (formEerrors) {
      return setErrors(formEerrors);
    }

    setDisabled(true);

    await saveConfigs(form);

    setDisabled(false);

    stepCompleted("configs", form);
  }

  return (
    <div className="row">
      <h2 className="mb-2 text-info">CONFIGS</h2>
      <form>
        {Object.entries(undefinedFields).map(([name, props]) => (
          <FormField
            key={name}
            name={name}
            label={props.label}
            placeholder={props.placeholder}
            type={props.type}
            errors={errors[name]}
            onChange={handleChange}
            disabled={disabled}
            value={form[name]}
          />
        ))}
        <div className="d-grid gap-3">
          <SubmitButton onClick={handleSubmit} disabled={disabled} />
        </div>
      </form>
    </div>
  );
};