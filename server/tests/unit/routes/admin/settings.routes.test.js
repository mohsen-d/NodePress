const express = require("express");

const router = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

describe("admin routes", () => {
  const settingsCtrl = require("../../../../controllers/settings.controller");

  it("should map each route to its corresponding controller method", () => {
    const settingsRoute = require("../../../../routes/admin/settings.routes");
    expect(router.put).toHaveBeenCalledWith("/", settingsCtrl.updateSettings);
  });
});
