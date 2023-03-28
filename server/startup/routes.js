const express = require("express");
const isConfigured = require("../middlewares/isConfiguredMiddleware");
const home = require("../routes/home");

module.exports = function (app) {
  app.use(isConfigured);
  app.use("/", home);
};
