const mongoose = require("mongoose");

const Configs = mongoose.model(
  "config",
  new mongoose.Schema({
    websiteName: { type: String },
  })
);

module.exports.isConfigured = async function () {
  const count = await Configs.find().count();
  return count > 0;
};
