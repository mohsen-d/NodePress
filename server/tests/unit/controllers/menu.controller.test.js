const mongoose = require("mongoose");
const menuController = require("../../../controllers/menu.controller");
const menuDb = require("../../../database/menu.db");

const req = {};

const res = {
  send(response) {
    return {
      status: 200,
      body: response,
    };
  },
  status(code) {
    return {
      send(response) {
        return {
          status: code,
          body: response,
        };
      },
    };
  },
};

const menu = {
  title: "title",
  url: "url",
};

function mockDbMethod(method) {
  menuDb[method] = jest.fn();
}

describe("addMenu", () => {
  mockDbMethod("addMenu");

  beforeEach(() => {
    req.body = { ...menu };
  });

  it("should return with error code 400 if new menu is invalid", async () => {
    req.body.title = undefined;
    const result = await menuController.addMenu(req, res);
    expect(result.status).toBe(400);
    expect(result.body["title"]).not.toBeUndefined;
  });

  it("should pass valid new menu to database layer", () => {
    const result = menuController.addMenu(req, res);
    expect(menuDb.addMenu).toHaveBeenCalled();
  });

  it("should return the inserted menu", async () => {
    menuDb.addMenu.mockReturnValue(menu);
    const result = await menuController.addMenu(req, res);
    expect(result.body).toEqual(menu);
  });

  it("should ignore ancestors field if it's set and sent", async () => {
    menu.ancestors = [new mongoose.Types.ObjectId().toHexString()];
    menuDb.addMenu.mockReturnValue(menu);
    const result = await menuController.addMenu(req, res);
    expect(result.ancestors).toBeUndefined();
  });
});
