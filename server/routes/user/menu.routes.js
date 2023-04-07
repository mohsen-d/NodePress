const menuCtrl = require("../../controllers/menu.controller");
const express = require("express");
const router = express.Router();

router.get("/", menuCtrl.getMenus);
router.get("/:id", menuCtrl.getMenuAndAncestors);

module.exports = router;
