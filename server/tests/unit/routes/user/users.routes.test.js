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
    expect(router.get).toHaveBeenCalledWith("/loggedin/", usersCtrl.getUser);
    expect(router.put).toHaveBeenCalledWith(
      "/loggedin/password",
      usersCtrl.changeCurrentUserPassword
    );
    expect(router.put).toHaveBeenCalledWith(
      "/loggedin/name",
      usersCtrl.changeCurrentUserName
    );
    expect(router.delete).toHaveBeenCalledWith(
      "/loggedin/",
      usersCtrl.deleteCurrentUser
    );
    expect(router.post).toHaveBeenCalledWith("/guest/signin", usersCtrl.signIn);
    expect(router.post).toHaveBeenCalledWith("/guest/signup", usersCtrl.signUp);
    expect(router.post).toHaveBeenCalledWith(
      "/guest/email/confirm/:token",
      usersCtrl.confirm
    );
    expect(router.get).toHaveBeenCalledWith(
      "/guest/password/recover/:email",
      usersCtrl.sendPasswordRecoveryEmail
    );
    expect(router.put).toHaveBeenCalledWith(
      "/guest/password/recover/:email",
      usersCtrl.recoverPassword
    );
  });
});
