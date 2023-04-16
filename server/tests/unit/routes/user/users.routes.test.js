const express = require("express");

const router = {
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

describe("user routes", () => {
  const usersCtrl = require("../../../../controllers/users.controller");

  it("should map each route to its corresponding controller method", () => {
    const usersRoute = require("../../../../routes/user/users.routes");
    expect(router.get).toHaveBeenCalledWith("/", usersCtrl.getUser);
    expect(router.put).toHaveBeenCalledWith(
      "/password",
      usersCtrl.changeCurrentUserPassword
    );
    expect(router.put).toHaveBeenCalledWith(
      "/name",
      usersCtrl.changeCurrentUserName
    );
    expect(router.delete).toHaveBeenCalledWith(
      "/",
      usersCtrl.deleteCurrentUser
    );
    expect(router.post).toHaveBeenCalledWith("/signin", usersCtrl.signIn);
    expect(router.post).toHaveBeenCalledWith("/signup", usersCtrl.signUp);
  });
});
