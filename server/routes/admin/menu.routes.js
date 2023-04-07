const menuCtrl = require("../../controllers/menu.controller");
const express = require("express");
const router = express.Router();

router.get("/", menuCtrl.getMenus);
router.get("/:id", menuCtrl.getMenu);
router.get("/:id/descendants", menuCtrl.getMenuAndDescendants);
router.post("/", menuCtrl.addMenu);
router.put("/:id", menuCtrl.updateMenu);
router.put("/:id/parent", menuCtrl.updateMenuParent);
router.delete("/", menuCtrl.deleteMenus);
router.delete("/:id", menuCtrl.deleteMenu);

module.exports = router;
