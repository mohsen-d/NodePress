const usersCtrl = require("../../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.get("/loggedin/", usersCtrl.getUser);
router.put("/loggedin/password", usersCtrl.changeCurrentUserPassword);
router.put("/loggedin/name", usersCtrl.changeCurrentUserName);
router.delete("/loggedin/", usersCtrl.deleteCurrentUser);

router.post("/guest/signin", usersCtrl.signIn);
router.post("/guest/signup", usersCtrl.signUp);
router.post("/guest/email/confirm/:token", usersCtrl.confirm);

module.exports = router;
