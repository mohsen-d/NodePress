const usersCtrl = require("../../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.get("/", usersCtrl.getUsers);
router.get("/:id", usersCtrl.getUser);
router.post("/", usersCtrl.addUser);
router.put("/:id", usersCtrl.updateUser);
router.put("/", usersCtrl.updateUsers);
router.delete("/:id", usersCtrl.deleteUser);
router.delete("/", usersCtrl.deleteUsers);

module.exports = router;
