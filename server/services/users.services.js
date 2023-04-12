const bcrypt = require("bcrypt");

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
  const { name, password, isActive, isConfirmed, role, ...invalid } = fields;
  return { name, password, isActive, isConfirmed, role };
};
