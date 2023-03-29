const Post = require("../models/post.model");
const postsDb = require("../database/posts.db");

module.exports.newPost = function (req, res) {
  let newPost = new Post(req.body);

  const { errors, isValid } = Post.validate(newPost);

  if (!isValid) return res.status(400).send(errors);

  newPost = postsDb.insert(newPost);

  return res.send(newPost);
};

module.exports.getPosts = function (req, res) {
  const list = postsDb.find(req.body);
  return res.send(list);
};

module.exports.getPost = function (req, res) {
  const post = postsDb.findOne(req.params.id);
  if (!post) return res.status(404).send("can't find the post");
  return res.send(post);
};

module.exports.delete = function (req, res) {
  const result = postsDb.delete(req.body.ids);
  return res.send(result);
};

module.exports.deletePost = function (req, res) {
  const post = postsDb.deletePost(req.params.id);

  if (!post) return res.status(404).send("post not found");

  return res.send(post);
};

module.exports.updatePost = function (req, res) {
  let post = new Post(req.body);

  const { errors, isValid } = Post.validate(post);

  if (!isValid) return res.status(400).send(errors);

  post = postsDb.updateById(req.params.id, post);

  if (!post) return res.status(404).send("post not found");

  return res.send(post);
};

module.exports.updatePostsDisplay = function (req, res) {
  if (typeof req.body.display !== "boolean")
    return res.status(400).send("bad request");

  const result = postsDb.updateDisplay(req.body.ids, req.body.display);
  return res.send(result);
};
