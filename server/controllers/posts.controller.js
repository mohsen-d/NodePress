const Post = require("../models/post.model");
const postsDb = require("../database/posts.db");
const postsSrv = require("../services/posts.services");

module.exports.addPost = function (req, res) {
  let newPost = new Post(req.body);

  const { errors, isValid } = Post.validate(newPost);

  if (!isValid) return res.status(400).send(errors);

  newPost = postsDb.addPost(newPost);

  return res.send(newPost);
};

module.exports.getPosts = function (req, res) {
  const params = postsSrv.buildGetParameters(req, req.body);
  const list = postsDb.getPosts(params);
  return res.send(list);
};

module.exports.getPost = function (req, res) {
  const params = postsSrv.buildGetParameters(req, req.params);
  const post = postsDb.getPost(params);
  if (!post) return res.status(404).send("can't find the post");
  return res.send(post);
};

module.exports.deletePosts = function (req, res) {
  const result = postsDb.deletePosts(req.body.ids);
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

  post = postsDb.updatePost(req.params.id, post);

  if (!post) return res.status(404).send("post not found");

  return res.send(post);
};

module.exports.updatePostsDisplay = function (req, res) {
  if (typeof req.body.display !== "boolean")
    return res.status(400).send("bad request");

  const result = postsDb.updatePostsDisplay(req.body.ids, req.body.display);
  return res.send(result);
};
