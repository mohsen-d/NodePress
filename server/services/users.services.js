const bcrypt = require("bcrypt");

module.exports.excludePassword = function (user) {
  const u = user.toObject();
  delete u.password;
  return u;
};

module.exports.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
