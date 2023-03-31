const Post = require("../models/post.model");
const postsSrv = require("../services/posts.services");

module.exports.addPost = async function (newPost) {
  await newPost.save();
  return newPost;
};

module.exports.getPosts = async function (parameters) {
  const filters = postsSrv.buildGetFilter(parameters);
  const options = postsSrv.buildGetOptions(parameters);

  const list = await Post.find(filters, null, options);
  return list;
};

module.exports.getPost = async function (parameters) {
  const filters = postsSrv.buildGetFilter(parameters);
  const post = await Post.findOne(filters);
  return post;
};

module.exports.deletePosts = async function (ids) {
  const result = await Post.deleteMany({ _id: { $in: ids } });
  return result;
};

module.exports.deletePost = async function (id) {
  const deletedPost = await Post.findByIdAndDelete(id);
  return deletedPost;
};

module.exports.updatePost = async function (id, post) {};

module.exports.updatePostsDisplay = async function (ids, display) {};
