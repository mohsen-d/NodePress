const usersCtrl = require("../../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.get("/", usersCtrl.getCurrentUser);
router.put("/password", usersCtrl.changeCurrentUserPassword);
router.put("/name", usersCtrl.changeCurrentUserName);
router.delete("/", usersCtrl.deleteCurrentUser);
router.post("/signin", usersCtrl.signIn);
router.post("/signup", usersCtrl.signUp);

module.exports = router;
