const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

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
