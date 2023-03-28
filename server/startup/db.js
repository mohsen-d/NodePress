const mongoose = require("mongoose");

module.exports = function () {
  const db = "mongodb://127.0.0.1/nodepress";
  mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));
};
