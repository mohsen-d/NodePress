const postsCtrl = require("../../controllers/posts.controller");
const express = require("express");
const router = express.Router();

router.get("/", postsCtrl.getPosts);
router.get("/:id", postsCtrl.getPost);

module.exports = router;
