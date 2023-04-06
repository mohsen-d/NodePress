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

    await menuController.addMenu(req, res);
    expect(
      menuDb.addMenu.mock.calls[menuDb.addMenu.mock.calls.length - 1][0]
        .ancestors.length
    ).toBe(0);
  });
});

describe("deleteMenu", () => {
  mockDbMethod("deleteMenu");

  req.params = { id: 1 };

  it("should pass id to database layer", async () => {
    await menuController.deleteMenu(req, res);
    expect(menuDb.deleteMenu).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no menu", async () => {
    menuDb.deleteMenu.mockReturnValue(0);

    const result = await menuController.deleteMenu(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the number of deleted menu and its descendants", async () => {
    menuDb.deleteMenu.mockReturnValue(3);

    const result = await menuController.deleteMenu(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(3);
  });
});

describe("deleteMenus", () => {
  mockDbMethod("deleteMenus");

  req.body = { ids: [1, 2, 3] };

  it("should pass ids to database layer", async () => {
    await menuController.deleteMenus(req, res);
    expect(menuDb.deleteMenus).toHaveBeenCalledWith(req.body.ids);
  });

  it("should return the number of deleted documents", async () => {
    menuDb.deleteMenus.mockReturnValue(3);
    const result = await menuController.deleteMenus(req, res);
    expect(result.body).toBe(3);
  });
});

describe("updateMenu", () => {
  mockDbMethod("updateMenu");

  beforeEach(() => {
    req.params = { id: 1 };
    req.body = { ...menu };
  });

  it("should return 400 error if data is invalid", async () => {
    req.body.title = undefined;
    const result = await menuController.updateMenu(req, res);
    expect(result.status).toBe(400);
  });

  it("should pass valid menu to database layer to be updated", async () => {
    const result = await menuController.updateMenu(req, res);
    expect(menuDb.updateMenu).toHaveBeenCalled();
  });

  it("should return 404 error if menu not found", async () => {
    menuDb.updateMenu.mockReturnValue(undefined);
    const result = await menuController.updateMenu(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the updated menu", async () => {
    menuDb.updateMenu.mockReturnValue(menu);
    const result = await menuController.updateMenu(req, res);
    expect(result.body).toEqual(menu);
  });

  it("should ignore parentId & ancestors fields if they're set and sent", async () => {
    menu.parentId = [new mongoose.Types.ObjectId().toHexString()];
    menu.ancestors = [new mongoose.Types.ObjectId().toHexString()];

    await menuController.addMenu(req, res);
    expect(menuDb.updateMenu).toHaveBeenCalledWith(1, {
      title: "title",
      url: "url",
    });
  });
});

describe("getMenu", () => {
  mockDbMethod("getMenu");

  req.params = { id: 1 };

  it("should pass id to database layer", async () => {
    await menuController.getMenu(req, res);
    expect(menuDb.getMenu).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no menu", async () => {
    const result = await menuController.getMenu(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the menu if found", async () => {
    menuDb.getMenu.mockReturnValue(menu);

    const result = await menuController.getMenu(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(menu);
  });
});

describe("getMenus", () => {
  mockDbMethod("getMenus");

  req.body = { _id: 1 };

  it("should get menu from database layer", async () => {
    await menuController.getMenus(req, res);
    expect(menuDb.getMenus).toHaveBeenCalledWith(req.body);
  });

  it("should return found menu to client", async () => {
    menuDb.getMenus.mockReturnValue([menu]);
    const result = await menuController.getMenus(req, res);
    expect(result.body).toEqual(expect.arrayContaining([menu]));
  });
});

describe("getMenuAndDescendants", () => {
  mockDbMethod("getMenuAndDescendants");
  menuDb.getMenuAndDescendants.mockReturnValue([]);

  req.params = { id: 1 };

  it("should pass id to database layer", async () => {
    await menuController.getMenuAndDescendants(req, res);
    expect(menuDb.getMenuAndDescendants).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no menu", async () => {
    const result = await menuController.getMenuAndDescendants(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the menu and its descendants if found", async () => {
    menuDb.getMenuAndDescendants.mockReturnValue([menu]);

    const result = await menuController.getMenuAndDescendants(req, res);

    expect(result.status).toBe(200);
    expect(result.body[0]).toEqual(menu);
  });
});
