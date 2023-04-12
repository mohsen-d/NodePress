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
