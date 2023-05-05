import Joi from "joi";
import utils from "../services/utils.services";

const rules = {
  domain: Joi.string()
    .trim()
    .required()
    .max(50)
    .pattern(
      /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
    )
    .label("domain"),
  database: Joi.string()
    .trim()
    .required()
    .max(150)
    .label("database connection")
    .pattern(
      /^(mongodb(?:\+srv)?(\:)(?:\/{2}){1})(?:\w+\:\w+\@)?(\w+?(?:\.\w+?)*)(\:)(\d+(?:\/){0,1})(?:\/\w+?)?(?:\?\w+?\=\w+?(?:\&\w+?\=\w+?)*)?$/
    ),
  jwtPrivateKey: Joi.string()
    .trim()
    .required()
    .min(8)
    .max(50)
    .label("private key"),
  host: Joi.string()
    .trim()
    .max(50)
    .required()
    .pattern(
      /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
    )
    .label("email host"),
  port: Joi.number().required().min(1).max(9999).label("port"),
  username: Joi.string().trim().required().max(50).label("username"),
  password: Joi.string().trim().required().max(50).label("password"),
  from: Joi.string()
    .trim()
    .required()
    .max(50)
    .email({ tlds: { allow: false } })
    .label("email address"),
};

export const fields = {
  domain: {
    type: "text",
    label: "Domain:",
    placeholder: "example: nodepress.com",
  },
  database: {
    type: "text",
    label: "Database connection:",
    placeholder: "mongodb://",
  },
  jwtPrivateKey: {
    type: "text",
    label: "Private Key:",
    placeholder: "",
  },
  host: { type: "text", label: "Email host:", placeholder: "smtp.domain.com" },
  port: {
    type: "text",
    label: "Email host port:",
    placeholder: "example : 3000",
  },
  username: { type: "text", label: "Email host username:", placeholder: "" },
  password: {
    type: "password",
    label: "Email host password:",
    placeholder: "",
  },
  from: {
    type: "email",
    label: "Email sender address:",
    placeholder: "example: noreply@domain.com",
  },
};

const configsSchema = Joi.object(rules).options({ stripUnknown: true });

export function validate(inputs) {
  return utils.extractErrors(
    configsSchema.validate(inputs, { abortEarly: false })
  );
}

export function validateField(fieldName, fieldValue) {
  return utils.extractErrors(rules[fieldName].validate(fieldValue), fieldName);
}
