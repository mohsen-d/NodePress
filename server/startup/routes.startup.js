const express = require("express");
const isConfigured = require("../middlewares/isConfigured.middleware");
const home = require("../routes/user/home.routes");
const templatesSrv = require("../services/templates.services");

module.exports = function (app) {
  app.use(express.static(templatesSrv.getPath()));
  app.set("view engine", "ejs");
  app.set("views", templatesSrv.getPath());
  app.use(isConfigured);
  app.use("/", home);
};
