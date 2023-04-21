const Settings = require("../models/settings.model");
const settingsDb = require("../database/settings.db");

module.exports.updateSettings = async function (req, res) {
  const settings = new Settings(req.body);

  const { errors, isValid } = Settings.validate(settings);
  if (!isValid) return res.status(400).send(errors);

  const updatedSettings = await settingsDb.updateSettings(req.body);

  return res.send(updatedSettings);
};
