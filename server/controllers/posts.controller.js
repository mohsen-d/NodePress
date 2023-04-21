const Post = require("../models/post.model");
const postsDb = require("../database/posts.db");
const postsSrv = require("../services/posts.services");
const errorsSrv = require("../services/errors.services");

module.exports.addPost = async function (req, res) {
  let newPost = new Post(req.body);

  const { errors, isValid } = Post.validate(newPost);

  if (!isValid) return res.status(400).send(errors);

  newPost = await postsDb.addPost(newPost);

  return res.send(newPost);
};

module.exports.getPosts = async function (req, res) {
  const params = postsSrv.buildGetParameters(req, req.body);
  const list = await postsDb.getPosts(params);
  return res.send(list);
};

module.exports.getPost = async function (req, res) {
  const params = postsSrv.buildGetParameters(req, req.params);
  const post = await postsDb.getPost(params);
  if (!post) return res.status(404).send(errorsSrv._404("post"));
  return res.send(post);
};

module.exports.deletePosts = async function (req, res) {
  const result = await postsDb.deletePosts(req.body.ids);
  return res.send(result);
};

module.exports.deletePost = async function (req, res) {
  const post = await postsDb.deletePost(req.params.id);

  if (!post) return res.status(404).send(errorsSrv._404("post"));

  return res.send(post);
};

module.exports.updatePost = async function (req, res) {
  let post = new Post(req.body);

  const { errors, isValid } = Post.validate(post);

  if (!isValid) return res.status(400).send(errors);

  post = await postsDb.updatePost(req.params.id, post);

  if (!post) return res.status(404).send(errorsSrv._404("post"));

  return res.send(post);
};

module.exports.updatePosts = async function (req, res) {
  const updateCommand = postsSrv.buildUpdateCommand(req.body);

  if (Object.keys(updateCommand).length == 0)
    return res.status(400).send(errorsSrv._400("paramteres"));

  const result = await postsDb.updatePosts(req.body.ids, updateCommand);
  return res.send(result);
};
