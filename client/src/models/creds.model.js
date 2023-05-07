import Joi from "joi";
import utils from "../services/utils.services";

const rules = {
  name: Joi.string()
    .trim()
    .required()
    .max(50)
    .pattern(/^[a-z\s\'\-]+$/i)
    .label("name"),
  email: Joi.string()
    .trim()
    .required()
    .max(50)
    .email({ tlds: { allow: false } })
    .label("email"),
  password: Joi.string()
    .trim()
    .required()
    .pattern(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    )
    .label("password"),
  confirm: Joi.ref("password"),
};

export const fields = {
  name: {
    type: "text",
    label: "Your name:",
    placeholder: "example: John Smith",
  },
  email: {
    type: "email",
    label: "Your email:",
    placeholder: "",
  },
  password: {
    type: "password",
    label: "Your password:",
    placeholder: "",
  },
  confirm: {
    type: "password",
    label: "Confirm your password:",
    placeholder: "",
  },
};

const schema = Joi.object(rules).options({
  stripUnknown: true,
});

export function validate(inputs) {
  return utils.extractErrors(schema.validate(inputs, { abortEarly: false }));
}

export function validateField(fieldName, fieldValue) {
  if (fieldName === "confirm") return;
  return utils.extractErrors(rules[fieldName].validate(fieldValue), fieldName);
}
