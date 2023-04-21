const settingsDb = require("../database/settings.db");
const config = require("config");

module.exports = async function () {
  const settings = await settingsDb.getSettings();
  Object.assign(config, settings.toObject());
};
