const express = require("express");

const router = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

const postsCtrl = require("../../../../controllers/posts.controller");

it("should map each route to its corresponding controller method", () => {
  const postsRoute = require("../../../../routes/admin/posts.route");
  expect(router.get).toHaveBeenCalledWith("/", postsCtrl.getPosts);
  expect(router.get).toHaveBeenCalledWith("/:id", postsCtrl.getPost);
  expect(router.post).toHaveBeenCalledWith("/", postsCtrl.addPost);
  expect(router.put).toHaveBeenCalledWith("/", postsCtrl.updatePostsDisplay);
  expect(router.put).toHaveBeenCalledWith("/:id", postsCtrl.updatePost);
  expect(router.delete).toHaveBeenCalledWith("/", postsCtrl.deletePosts);
  expect(router.delete).toHaveBeenCalledWith("/:id", postsCtrl.deletePost);
});
