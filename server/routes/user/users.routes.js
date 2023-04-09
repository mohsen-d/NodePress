const usersCtrl = require("../../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.get("/", usersCtrl.getCurrentUser);
router.put("/password", usersCtrl.changeCurrentUserPassword);
router.put("/name", usersCtrl.changeCurrentUserName);
router.delete("/", usersCtrl.deleteCurrentUser);

module.exports = router;
