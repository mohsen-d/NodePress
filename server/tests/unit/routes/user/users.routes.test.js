const express = require("express");

const router = {
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

const usersCtrl = require("../../../../controllers/users.controller");

it("should map each route to its corresponding controller method", () => {
  const usersRoute = require("../../../../routes/user/users.routes");
  expect(router.get).toHaveBeenCalledWith("/", usersCtrl.getCurrentUser);
  expect(router.put).toHaveBeenCalledWith(
    "/password",
    usersCtrl.changeCurrentUserPassword
  );
  expect(router.put).toHaveBeenCalledWith(
    "/name",
    usersCtrl.changeCurrentUserName
  );
  expect(router.delete).toHaveBeenCalledWith("/", usersCtrl.deleteCurrentUser);
});
