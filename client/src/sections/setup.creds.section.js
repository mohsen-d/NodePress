import React, { useState } from "react";

import FormField from "../components/formField.component";
import SubmitButton from "../components/submitButton.component";
import { validate, validateField, fields } from "../models/creds.model";
import { saveCreds } from "../services/setup.services";

export default ({ stepCompleted, onReturn, data }) => {
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);

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
    await saveCreds(form);
    setDisabled(false);

    stepCompleted("creds", form);
  }

  return (
    <div class="row">
      <h2 className="mb-2 text-info">ADMIN USER</h2>
      <form>
        {Object.entries(fields).map(([name, props]) => (
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
        <div class="d-grid gap-3">
          <button
            type="button"
            className="btn btn-secondary me-1"
            disabled={disabled}
            onClick={() => onReturn("creds")}
          >
            Back
          </button>
          <SubmitButton onClick={handleSubmit} disabled={disabled} />
        </div>
      </form>
    </div>
  );
};
