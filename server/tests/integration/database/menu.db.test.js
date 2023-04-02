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
