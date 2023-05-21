const configs = require("../database/configs");

module.exports = async function (req, res, next) {
  if (!req.url.startsWith("/setup")) {
    const isConfigured = await configs.isConfigured();
    if (!isConfigured) return res.redirect("/setup");
  }

  next();
};
