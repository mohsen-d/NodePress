const express = require("express");

const router = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

const menuCtrl = require("../../../../controllers/menu.controller");
describe("admin routes", () => {
  it("should map each route to its corresponding controller method", () => {
    const menuRoutes = require("../../../../routes/admin/menu.routes");
    expect(router.get).toHaveBeenCalledWith("/", menuCtrl.getMenus);
    expect(router.get).toHaveBeenCalledWith("/:id", menuCtrl.getMenu);
    expect(router.get).toHaveBeenCalledWith(
      "/:id/descendants",
      menuCtrl.getMenuAndDescendants
    );
    expect(router.post).toHaveBeenCalledWith("/", menuCtrl.addMenu);
    expect(router.put).toHaveBeenCalledWith("/:id", menuCtrl.updateMenu);
    expect(router.put).toHaveBeenCalledWith(
      "/:id/parent",
      menuCtrl.updateMenuParent
    );
    expect(router.delete).toHaveBeenCalledWith("/", menuCtrl.deleteMenus);
    expect(router.delete).toHaveBeenCalledWith("/:id", menuCtrl.deleteMenu);
  });
});
