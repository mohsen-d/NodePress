const express = require("express");

const router = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

const usersCtrl = require("../../../../controllers/users.controller");

it("should map each route to its corresponding controller method", () => {
  const usersRoute = require("../../../../routes/admin/users.routes");
  expect(router.post).toHaveBeenCalledWith("/", usersCtrl.addUser);
  expect(router.get).toHaveBeenCalledWith("/", usersCtrl.getUsers);
  expect(router.get).toHaveBeenCalledWith("/:id", usersCtrl.getUser);
  expect(router.put).toHaveBeenCalledWith("/", usersCtrl.updateUsers);
  expect(router.put).toHaveBeenCalledWith("/:id", usersCtrl.updateUser);
  expect(router.delete).toHaveBeenCalledWith("/", usersCtrl.deleteUsers);
  expect(router.delete).toHaveBeenCalledWith("/:id", usersCtrl.deleteUser);
});
