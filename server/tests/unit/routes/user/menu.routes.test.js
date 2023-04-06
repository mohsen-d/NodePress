const express = require("express");

const router = {
  get: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

const menuCtrl = require("../../../../controllers/menu.controller");

describe("user routes", () => {
  it("should map each route to its corresponding controller method", () => {
    const menuRoutes = require("../../../../routes/user/menu.routes");
    expect(router.get).toHaveBeenCalledWith("/", menuCtrl.getMenus);
    expect(router.get).toHaveBeenCalledWith(
      "/:id",
      menuCtrl.getMenuAndAncestors
    );
  });
});
