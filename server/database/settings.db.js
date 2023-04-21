const Settings = require("../models/settings.model");

module.exports.updateSettings = async function (updateCommand) {
  const id = await Settings.findOne().select("_id");
  const updatedSettings = await Settings.findByIdAndUpdate(id, updateCommand, {
    returnDocument: "after",
  });
  return updatedSettings;
};

module.exports.getSettings = async function () {
  return await Settings.findOne().lean();
};
