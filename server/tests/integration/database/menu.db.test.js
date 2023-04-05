const menuDb = require("../../../database/menu.db");
const Menu = require("../../../models/menu.model");
const mongoose = require("mongoose");
require("../../../startup/db")();

afterAll(() => {
  mongoose.disconnect();
});

describe("addMenu", () => {
  afterEach(async () => {
    await Menu.deleteMany({});
  });

  const _id = new mongoose.Types.ObjectId().toHexString();

  async function exec() {
    return await menuDb.addMenu(
      new Menu({
        _id: _id,
        title: "title",
        url: "http://",
      })
    );
  }

  it("should save menu to the database", async () => {
    await exec();

    const menu = await Menu.find({ title: "title" });

    expect(menu).not.toBeNull();
  });

  it("should return saved menu", async () => {
    const menu = await exec();

    expect(menu).toHaveProperty("_id");
    expect(menu).toHaveProperty("title", "title");
  });

  it("should put parentId in the ancestors", async () => {
    await exec();

    await menuDb.addMenu(
      new Menu({
        parentId: _id,
        title: "child",
        url: "http://",
      })
    );

    const childMenu = await Menu.findOne({ title: "child" });

    expect(childMenu.ancestors.length).toBe(1);
    expect(childMenu.ancestors[0].toHexString()).toBe(_id);
  });

  it("should remove given parentId if it matches no menu", async () => {
    await exec();

    await menuDb.addMenu(
      new Menu({
        parentId: new mongoose.Types.ObjectId().toHexString(),
        title: "child",
        url: "http://",
      })
    );

    const childMenu = await Menu.findOne({ title: "child" });

    expect(childMenu.ancestors.length).toBe(0);
    expect(childMenu.parentId).toBeUndefined();
  });

  it("should put parent's ancestors in the child's ancestors", async () => {
    await exec();

    const _childId = new mongoose.Types.ObjectId().toHexString();

    await menuDb.addMenu(
      new Menu({
        _id: _childId,
        parentId: _id,
        title: "first child",
        url: "http://",
      })
    );

    await menuDb.addMenu(
      new Menu({
        parentId: _childId,
        title: "grand child",
        url: "http://",
      })
    );

    const grandChildMenu = await Menu.findOne({ title: "grand child" });

    expect(grandChildMenu.ancestors.length).toBe(2);
    expect(grandChildMenu.ancestors[0].toHexString()).toBe(_id);
    expect(grandChildMenu.ancestors[1].toHexString()).toBe(_childId);
  });
});

describe("deleteMenu", () => {
  let menu;
  const _id = new mongoose.Types.ObjectId().toHexString();
  const _childId = new mongoose.Types.ObjectId().toHexString();
  const _grandChildId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    menu = await Menu.insertMany([
      {
        _id: _id,
        title: "t1",
      },
      {
        _id: _childId,
        parentId: _id,
        ancestors: [_id],
        title: "t2",
      },
      {
        _id: _grandChildId,
        parentId: _childId,
        ancestors: [_id, _childId],
        title: "t3",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should delete menu with the given id", async () => {
    const deletedCount = await menuDb.deleteMenu(_grandChildId);
    expect(deletedCount).toBe(1);

    const deletedMenu = await Menu.findById(_grandChildId);
    expect(deletedMenu).toBeNull();
  });

  it("should delete menu with the given id and its child menus", async () => {
    const deletedCount = await menuDb.deleteMenu(_childId);
    expect(deletedCount).toBe(2);

    const deletedMenus = await Menu.find({
      $or: [{ _id: _childId }, { _id: _grandChildId }],
    });
    expect(deletedMenus.length).toBe(0);
  });
});

describe("deleteMenus", () => {
  let menu;
  const _id = new mongoose.Types.ObjectId().toHexString();
  const _childId = new mongoose.Types.ObjectId().toHexString();
  const _grandChildId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    menu = await Menu.insertMany([
      {
        _id: _id,
        title: "t1",
      },
      {
        _id: _childId,
        parentId: _id,
        ancestors: [_id],
        title: "t2",
      },
      {
        _id: _grandChildId,
        parentId: _childId,
        ancestors: [_id, _childId],
        title: "t3",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should delete menus whose id is in the given ids", async () => {
    const deletedCount = await menuDb.deleteMenu([_grandChildId]);
    expect(deletedCount).toBe(1);

    const deletedMenu = await Menu.findById(_grandChildId);
    expect(deletedMenu).toBeNull();
  });

  it("should delete menus whose id is in the given ids and their child menus", async () => {
    const deletedCount = await menuDb.deleteMenu([_id, _childId]);
    expect(deletedCount).toBe(3);

    const deletedMenus = await Menu.find();
    expect(deletedMenus.length).toBe(0);
  });
});

describe("updateMenu", () => {
  let menu;

  beforeEach(async () => {
    menu = await Menu.insertMany([
      {
        title: "t1",
        url: "u1",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should update the menu with given id", async () => {
    const updates = {
      title: "title",
      url: "url",
    };

    await menuDb.updateMenu(menu[0]._id, updates);

    const updatedMenu = await Menu.findById(menu[0]._id);
    expect(updatedMenu).toHaveProperty("title", "title");
    expect(updatedMenu).toHaveProperty("url", "url");
  });

  it("should return null if given id match no menu", async () => {
    const id = new Array(25).join(1);
    const updates = {
      title: "title",
      url: "url",
    };

    const updatedMenu = await menuDb.updateMenu(id, updates);

    expect(updatedMenu).toBeNull();
  });
});

describe("getMenus", () => {
  let menu;

  const _id = new mongoose.Types.ObjectId().toHexString();
  const _childId = new mongoose.Types.ObjectId().toHexString();
  const _grandChildId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    menu = await Menu.insertMany([
      {
        _id: _id,
        title: "t1",
      },
      {
        _id: _childId,
        parentId: _id,
        ancestors: [_id],
        title: "t2",
      },
      {
        _id: _grandChildId,
        parentId: _childId,
        ancestors: [_id, _childId],
        title: "t3",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should return all menus if no filter or option is sent", async () => {
    const menus = await menuDb.getMenus();
    expect(menus.length).toBe(3);
  });

  describe("options", () => {
    it("should sort menus by given field in given order", async () => {
      const options = { sort: { by: "title", order: -1 } };

      const menus = await menuDb.getMenus(options);
      expect(menus.length).toBe(3);
      expect(menus[0].title).toBe("t3");
    });

    it("should limit menus according to the pageSize", async () => {
      const options = { pageSize: 2 };

      const menus = await menuDb.getMenus(options);
      expect(menus.length).toBe(2);
    });

    it("should return menus according to the pageSize and page", async () => {
      const options = { pageSize: 2, page: 2 };

      const menus = await menuDb.getMenus(options);
      expect(menus.length).toBe(1);
    });

    it("should return sorted menus according to the pageSize and page", async () => {
      const options = {
        sort: { by: "title", order: -1 },
        pageSize: 2,
        page: 2,
      };

      const menus = await menuDb.getMenus(options);
      expect(menus.length).toBe(1);
      expect(menus[0].title).toBe("t1");
    });

    it("should work with numbers sent in strings", async () => {
      const options = {
        sort: { by: "title", order: "-1" },
        pageSize: "2",
        page: "2",
      };

      const menus = await menuDb.getMenus(options);
      expect(menus.length).toBe(1);
      expect(menus[0].title).toBe("t1");
    });
  });

  describe("filters", () => {
    it("should return empty array if no menu matches filters", async () => {
      const filters = { title: "tttt" };
      const menus = await menuDb.getMenus(filters);
      expect(menus.length).toBe(0);
    });

    it("should return menus which contain the keyword in their string fields", async () => {
      const filters = { title: "1" };
      const menus = await menuDb.getMenus(filters);
      expect(menus.length).toBe(1);
    });

    it("should return menus which meet all filters", async () => {
      const filters = { _id: _id, title: "1" };
      const menus = await menuDb.getMenus(filters);
      expect(menus.length).toBe(1);
    });

    it("should return descendants of a menu", async () => {
      const filters = { ancestors: _id };
      const menus = await menuDb.getMenus(filters);
      expect(menus.length).toBe(2);
    });
  });
});

describe("getMenuAndDescendants", () => {
  const _id = new mongoose.Types.ObjectId().toHexString();
  const _childId = new mongoose.Types.ObjectId().toHexString();
  const _grandChildId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    await Menu.insertMany([
      {
        _id: _id,
        title: "t1",
      },
      {
        _id: _childId,
        parentId: _id,
        ancestors: [_id],
        title: "t2",
      },
      {
        _id: _grandChildId,
        parentId: _childId,
        ancestors: [_id, _childId],
        title: "t3",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should return menu with given id and its children", async () => {
    const menu = await menuDb.getMenuAndDescendants(_id);
    expect(menu.length).toBe(3);
  });
});

describe("getMenuAndAncestors", () => {
  const _id = new mongoose.Types.ObjectId().toHexString();
  const _childId = new mongoose.Types.ObjectId().toHexString();
  const _grandChildId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    await Menu.insertMany([
      {
        _id: _id,
        title: "t1",
      },
      {
        _id: _childId,
        parentId: _id,
        ancestors: [_id],
        title: "t2",
      },
      {
        _id: _grandChildId,
        parentId: _childId,
        ancestors: [_id, _childId],
        title: "t3",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should return menu with given id and its ancestors", async () => {
    const menu = await menuDb.getMenuAndAncestors(_grandChildId);
    expect(menu.length).toBe(3);
  });
});

describe("getMenu", () => {
  const _id = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    await Menu.insertMany([
      {
        _id: _id,
        title: "t1",
      },
      {
        title: "t1",
      },
    ]);
  });

  afterEach(async () => {
    await Menu.deleteMany({});
  });

  it("should return null if no menu matches the given id", async () => {
    const menu = await menuDb.getMenu(
      new mongoose.Types.ObjectId().toHexString()
    );
    expect(menu).toBeNull();
  });

  it("should return the menu with the given id", async () => {
    const menu = await menuDb.getMenu(_id);
    expect(menu).not.toBeNull();
  });
});
