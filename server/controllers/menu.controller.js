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
