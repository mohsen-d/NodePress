const express = require("express");

const router = {
  get: jest.fn(),
  put: jest.fn(),
};

express.Router = jest.fn().mockReturnValue(router);

describe("admin routes", () => {
  const configCtrl = require("../../../../controllers/config.controller");

  it("should map each route to its corresponding controller method", () => {
    const configRoute = require("../../../../routes/admin/config.routes");
    expect(router.put).toHaveBeenCalledWith("/", configCtrl.updateConfig);
    expect(router.get).toHaveBeenCalledWith("/", configCtrl.getUndefinedFields);
  });
});
