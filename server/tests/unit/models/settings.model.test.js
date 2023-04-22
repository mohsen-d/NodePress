const Settings = require("../../../models/settings.model");

describe("validate", () => {
  let settings;
  beforeEach(() => {
    settings = new Settings({
      title: "My Nodejs blog",
      description: "My tutorials, tips and tricks about nodejs",
      keywords: ["nodejs", "coding", "tutorial"],
      favicon: "default_favicon.png",
      banner: "default_banner.jpg",
      copyright: "all rights are reserved for Me &copy; 2023",
    });
  });

  describe("valid settings", () => {
    it("should pass a valid settings", () => {
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(true);
    });
  });

  describe("title", () => {
    it("should consider a title longer than 100 characters as invalid", () => {
      settings.title = new Array(102).join("a");
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider an empty title as invalid", () => {
      settings.title = "";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider spaces-only title as invalid", () => {
      settings.title = "   ";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["title"]).toBeDefined();
    });
  });

  describe("description", () => {
    it("should consider description longer than 150 characters as invalid", () => {
      settings.description = new Array(152).join("a");
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["description"]).toBeDefined();
    });
  });

  describe("keywords", () => {
    it("should consider a keyword longer than 50 characters as invalid", () => {
      const keyword = new Array(52).join("a");
      settings.keywords = [keyword];
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["keywords"]).toBeDefined();
    });

    it("should consider an empty keyword as invalid", () => {
      settings.keywords = [""];
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["keywords"]).toBeDefined();
    });

    it("should consider an only-spaces keyword as invalid", () => {
      settings.keywords = ["    "];
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["keywords"]).toBeDefined();
    });
  });

  describe("favicon", () => {
    it("should consider a favicon longer than 50 characters as invalid", () => {
      settings.favicon = new Array(52).join("a") + ".jpg";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["favicon"]).toBeDefined();
    });

    it("should consider an empty favicon as invalid", () => {
      settings.favicon = "";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["favicon"]).toBeDefined();
    });

    it("should consider spaces-only favicon as invalid", () => {
      settings.favicon = "   ";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["favicon"]).toBeDefined();
    });
  });

  describe("banner", () => {
    it("should consider a banner longer than 50 characters as invalid", () => {
      settings.banner = new Array(52).join("a") + ".jpg";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["banner"]).toBeDefined();
    });
  });

  describe("copyright", () => {
    it("should consider a copyright longer than 150 characters as invalid", () => {
      settings.copyright = new Array(152).join("a");
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["copyright"]).toBeDefined();
    });

    it("should consider an empty copyright as invalid", () => {
      settings.copyright = "";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["copyright"]).toBeDefined();
    });

    it("should consider spaces-only copyright as invalid", () => {
      settings.copyright = "   ";
      const result = Settings.validate(settings);
      expect(result.isValid).toBe(false);
      expect(result.errors["copyright"]).toBeDefined();
    });
  });
});

describe("default values", () => {
  it("should set default values", () => {
    const settings = new Settings();

    expect(settings.title).toBeDefined();
    expect(settings.favicon).toBeDefined();
    expect(settings.copyright).toBeDefined();
    expect(settings.landingPage).toBeDefined();
    expect(settings.enableMembership).toBeDefined();
    expect(settings.isSiteDown).toBeDefined();
  });
});
