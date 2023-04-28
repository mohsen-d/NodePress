const express = require("express");
const isConfigured = require("../middlewares/isConfiguredMiddleware");
const home = require("../routes/home");
const templatesSrv = require("../services/templates.services");

module.exports = function (app) {
  app.use(express.static(templatesSrv.getPath()));
  app.set("view engine", "ejs");
  app.set("views", templatesSrv.getPath());
  //app.use(isConfigured);
  app.use("/", home);
};
