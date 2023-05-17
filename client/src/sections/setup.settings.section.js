import React, { useState } from "react";

import FormField from "../components/formField.component";
import SubmitButton from "../components/submitButton.component";
import { validate, validateField, fields } from "../models/settings.model";
import { saveSettings } from "../services/setup.services";

export default ({ stepCompleted, onReturn, data }) => {
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);

  function getValue(target) {
    if (target.type === "file") return target.files[0];

    if (["landingPage", "enableMembership"].includes(target.id))
      return target.checked;

    return target.value;
  }

  function handleChange(e) {
    const value = getValue(e.target);

    const error = validateField(e.target.id, value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [e.target.id]: error ? error[e.target.id] : undefined,
    }));

    setForm((currentForm) => ({
      ...currentForm,
      [e.target.id]: value,
    }));
  }

  async function handleSubmit() {
    const validationResult = validate(form);

    console.log(validationResult);

    if (validationResult.error) {
      return setErrors(validationResult.error);
    }

    setDisabled(true);
    await saveSettings(validationResult.value);
    setDisabled(false);

    stepCompleted("settings", form);
  }

  return (
    <div className="row">
      <h2 className="mb-2 text-info">SETTINGS</h2>
      <form>
        {Object.entries(fields).map(([name, props]) => {
          return (
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
          );
        })}
        <div className="d-grid gap-3">
          <button
            type="button"
            className="btn btn-secondary me-1"
            disabled={disabled}
            onClick={() => onReturn("settings")}
          >
            Back
          </button>
          <SubmitButton onClick={handleSubmit} disabled={disabled} />
        </div>
      </form>
    </div>
  );
};
