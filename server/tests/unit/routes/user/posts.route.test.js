const express = require("express");

const router = {
  get: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

const postsCtrl = require("../../../../controllers/posts.controller");

it("should map each route to its corresponding controller method", () => {
  const postsRoute = require("../../../../routes/user/posts.route");
  expect(router.get).toHaveBeenCalledWith("/", postsCtrl.getPosts);
  expect(router.get).toHaveBeenCalledWith("/:id", postsCtrl.getPost);
});
