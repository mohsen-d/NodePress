const configCtrl = require("../../controllers/config.controller");
const express = require("express");
const router = express.Router();

router.get("/", configCtrl.getUndefinedFields);
router.put("/", configCtrl.updateConfig);

module.exports = router;
