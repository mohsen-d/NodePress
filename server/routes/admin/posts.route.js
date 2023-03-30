const postsCtrl = require("../../controllers/posts.controller");
const express = require("express");
const router = express.Router();

router.get("/", postsCtrl.getPosts);
router.get("/:id", postsCtrl.getPost);
router.post("/", postsCtrl.addPost);
router.put("/", postsCtrl.updatePostsDisplay);
router.put("/:id", postsCtrl.updatePost);
router.delete("/", postsCtrl.deletePosts);
router.delete("/:id", postsCtrl.deletePost);

module.exports = router;
