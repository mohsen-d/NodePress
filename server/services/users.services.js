const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

module.exports.excludePasswords = function (users) {
  const usersWithoutPassword = [];
  if (users.length > 0) {
    users.forEach((u) => {
      const su = u.toObject();
      delete su.password;
      usersWithoutPassword.push(su);
    });
  }
  return usersWithoutPassword;
};

module.exports.excludePassword = function (user) {
  return module.exports.excludePasswords([user])[0];
};

module.exports.hashPassword = async function (password) {
  if (typeof password !== "string") return "";
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports.buildUpdateCommand = function (fields) {
  const updateCommand = {};
  if (typeof fields.isActive === "boolean")
    updateCommand.isActive = fields.isActive;

  if (typeof fields.isConfirmed === "boolean")
    updateCommand.isConfirmed = fields.isConfirmed;

  return updateCommand;
};

module.exports.filterUpdateFields = function (fields) {
  const validFields = ["name", "password", "isActive", "isConfirmed", "role"];
  return filterFields(fields, validFields);
};

module.exports.comparePasswords = async function (
  plainPassword,
  hashedPassword
) {
  if (typeof plainPassword != "string" || typeof hashedPassword != "string")
    return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports.verifyToken = function (token) {
  try {
    return jwt.verify(token, config.get("jwtPrivateKey"));
  } catch (ex) {
    return false;
  }
};

module.exports.filterSignupFields = function (fields) {
  const validFields = ["name", "email", "password"];
  return filterFields(fields, validFields);
};

function filterFields(fields, validFields) {
  const output = {};

  Object.keys(fields).forEach((f) => {
    if (validFields.includes(f)) output[f] = fields[f];
  });

  return output;
}

module.exports.buildGetFilter = function (parameters) {
  const filter = {};
  const params = { ...parameters };

  const schema = Joi.object({
    _id: Joi.string().hex().length(24),
    name: Joi.string().max(50).truncate(),
    email: Joi.string().max(50).truncate(),
    role: Joi.string().valid("admin", "user"),
    source: Joi.string().valid("local", "google", "outlook"),
    isActive: Joi.boolean(),
    isConfirmed: Joi.boolean(),
    createdAt: Joi.object().keys({
      from: Joi.date(),
      to: Joi.date(),
    }),
  });

  const { value, error } = schema.validate(params, { abortEarly: false });

  if (error) {
    error.details.forEach((d) => {
      const key = d.context.key;
      delete params[key];
    });
  }

  for (const param in params) {
    if (params[param] === undefined || params[param] === null) continue;

    switch (true) {
      case ["_id", "isActive", "isConfirmed"].includes(param):
        filter[param] = params[param];
        break;

      case ["name", "email", "role", "source"].includes(param):
        filter[param] = new RegExp(params[param].substring(0, 50), "i");
        break;

      case param == "createdAt":
        filter[param] = {
          $gte: params[param].from,
          $lte: params[param].to,
        };
        break;
    }
  }
  return filter;
};

module.exports.buildGetOptions = function (parameters = {}) {
  const options = {};

  const sortSchema = Joi.object({
    by: Joi.string()
      .required()
      .valid("name", "email", "role", "createdAt", "source"),
    order: Joi.number().required().valid(1, -1),
  }).required();

  let validationResult = sortSchema.validate(parameters.sort);
  options.sort = validationResult.error
    ? { createdAt: -1 }
    : { [validationResult.value.by]: validationResult.value.order };

  const pageSizeSchema = Joi.number().required().min(1).max(50);
  validationResult = pageSizeSchema.validate(parameters.pageSize);
  options.limit = validationResult.error ? 10 : validationResult.value;

  const pageSchema = Joi.number().required().min(1).max(1000);
  validationResult = pageSchema.validate(parameters.page);
  options.skip = validationResult.error
    ? 0
    : (validationResult.value - 1) * options.limit;

  return options;
};
