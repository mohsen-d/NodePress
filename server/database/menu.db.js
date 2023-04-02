const Menu = require("../models/menu.model");
const menuSrv = require("../services/menu.services");

module.exports.addMenu = async function (newMenu) {
  if (newMenu.parentId) {
    const parent = await Menu.findById(newMenu.parentId);

    if (parent) {
      const ancestors = parent.ancestors;

      ancestors.push(newMenu.parentId);

      newMenu.ancestors = ancestors;
    } else {
      newMenu.parentId = undefined;
    }
  }
  await newMenu.save();
  return newMenu;
};

module.exports.deleteMenu = async function (id) {
  const result = await Menu.deleteMany({
    $or: [{ _id: id }, { ancestors: id }],
  });
  return result.deletedCount;
};

module.exports.deleteMenus = async function (ids) {
  const result = await Menu.deleteMany({
    $or: [{ _id: { $in: ids } }, { ancestors: { $in: ids } }],
  });
  return result.deletedCount;
};

module.exports.updateMenu = async function (id, menu) {
  const updatedMenu = await Menu.findByIdAndUpdate(id, { $set: menu });
  return updatedMenu;
};

module.exports.getMenus = async function (parameters) {
  const filters = menuSrv.buildGetFilter(parameters);
  const options = menuSrv.buildGetOptions(parameters);

  const list = await Menu.find(filters, null, options);
  return list;
};

module.exports.getMenuAndDescendants = async function (id) {
  const list = await Menu.find({
    $or: [{ _id: id }, { ancestors: id }],
  });
  return list;
};

/*

module.exports.getMenu = async function (parameters) {
  const filters = menusSrv.buildGetFilter(parameters);
  const menu = await Menu.findOne(filters);
  return menu;
};




*/
