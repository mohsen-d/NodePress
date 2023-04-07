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

module.exports.getMenuAndAncestors = async function (id) {
  const list = [];
  const menu = await Menu.findById(id);
  if (menu) {
    list.push(menu);
    if (menu.ancestors.length > 0) {
      const ancestors = await Menu.find({ _id: { $in: menu.ancestors } });
      list.push(...ancestors);
    }
  }
  return list;
};

module.exports.getMenu = async function (id) {
  const menu = await Menu.findById(id);
  return menu;
};

module.exports.updateMenuParent = async function (id, newParentId) {
  let menu = await Menu.findOne({ _id: id });
  if (!menu) return undefined;

  let newParent = {};
  let newAncestors = [];
  const oldAncestors = menu.ancestors;

  if (newParentId) {
    newParent = await Menu.findById({ _id: newParentId });
    if (!newParent) return undefined;

    newAncestors = newParent.ancestors.concat([newParent._id]);
  }

  let updateCommand = newParentId
    ? { parentId: newParent._id, ancestors: newAncestors }
    : { $unset: { parentId: 1 }, ancestors: newAncestors };

  menu = await Menu.findByIdAndUpdate(menu._id, updateCommand, {
    returnDocument: "after",
  });

  updateCommand = { $pull: { ancestors: { $in: oldAncestors } } };
  await Menu.updateMany({ ancestors: menu._id }, updateCommand);

  updateCommand = {
    $push: { ancestors: { $each: newAncestors, $position: 0 } },
  };
  await Menu.updateMany({ ancestors: menu._id }, updateCommand);

  return menu;
};
