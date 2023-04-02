const Menu = require("../../../models/menu.model");
const mongoose = require("mongoose");

describe("validate", () => {
  let menu;
  beforeEach(() => {
    menu = new Menu({
      title: "menu",
      url: "http://",
      parentId: new mongoose.Types.ObjectId().toHexString(),
    });
  });

  describe("valid menu", () => {
    it("should pass a valid menu", () => {
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(true);
    });
  });

  describe("title", () => {
    it("should consider a menu without title as invalid", () => {
      menu.title = undefined;
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider a title longer than 50 characters as invalid", () => {
      menu.title = new Array(52).join("a");
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider an empty title as invalid", () => {
      menu.title = "";
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider spaces-only title as invalid", () => {
      menu.title = "   ";
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });
  });

  describe("url", () => {
    it("should consider a url longer than 250 characters as invalid", () => {
      menu.url = new Array(252).join("a");
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(false);
      expect(result.errors["url"]).toBeDefined();
    });
  });

  describe("parentId", () => {
    it("should consider a non-objectId parentId as invalid", () => {
      menu.parentId = 1;
      const result = Menu.validate(menu);
      expect(result.isValid).toBe(false);
      expect(result.errors["parentId"]).toBeDefined();
    });
  });
});
