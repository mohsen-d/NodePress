const settingsCtrl = require("../../controllers/settings.controller");
const express = require("express");
const router = express.Router();

router.put("/", settingsCtrl.updateSettings);

module.exports = router;
