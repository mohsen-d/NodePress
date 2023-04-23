const configSrv = require("../services/config.services");
const Config = require("../models/config.model");

module.exports.updateConfig = function (req, res) {
  const { value, error } = Config.validate(req.body);
  if (error) return res.status(400).send(error);

  configSrv.updateConfigFields(value);
  return res.send(true);
};

module.exports.getUndefinedFields = function (req, res) {
  return configSrv.getUndefinedFields();
};
