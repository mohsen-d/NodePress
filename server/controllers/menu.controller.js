const Menu = require("../models/menu.model");
const menuDb = require("../database/menu.db");
const menuSrv = require("../services/menu.services");
const errorsSrv = require("../services/errors.services");

module.exports.addMenu = async function (req, res) {
  let newMenu = new Menu({
    title: req.body.title,
    url: req.body.url,
    parentId: req.body.parentId,
  });

  const { errors, isValid } = Menu.validate(newMenu);

  if (!isValid) return res.status(400).send(errors);

  newMenu = await menuDb.addMenu(newMenu);

  return res.send(newMenu);
};

module.exports.deleteMenu = async function (req, res) {
  const deletedCount = await menuDb.deleteMenu(req.params.id);

  if (deletedCount == 0) return res.status(404).send(errorsSrv._404("menu"));

  return res.send(deletedCount);
};

module.exports.deleteMenus = async function (req, res) {
  const result = await menuDb.deleteMenus(req.body.ids);
  return res.send(result);
};
