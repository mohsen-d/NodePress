const configs = require("../database/configs");

module.exports = async function (req, res, next) {
  const isConfigured = await configs.isConfigured();
  if (!isConfigured) return res.redirect("/setup");

  next();
};
