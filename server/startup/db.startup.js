const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("database");
  mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));
};
