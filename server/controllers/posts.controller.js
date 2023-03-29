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
