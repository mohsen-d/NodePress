const mongoose = require("mongoose");
require("../../../startup/db")();

const settingsDb = require("../../../database/settings.db");
const Settings = require("../../../models/settings.model");

afterAll(() => {
  mongoose.disconnect();
});

describe("updateSettings", () => {
  let settings;

  beforeEach(async () => {
    settings = await Settings.insertMany([
      {
        title: "Site Title",
        keywords: ["nodejs", "coding", "tutorial"],
        favicon: "default_favicon.png",
        banner: "default_banner.jpg",
        copyright: "all rights are reserved for Me &copy; 2023",
        landingPage: true,
        isSiteDown: false,
        enableMembership: true,
      },
    ]);
  });

  afterEach(async () => {
    await Settings.deleteMany({});
  });

  it("should update the settings", async () => {
    const updates = {
      title: "My Nodejs Blog",
      description: "My tutorials, tips and tricks about nodejs",
    };

    await settingsDb.updateSettings(updates);

    const updatedSettings = await Settings.findById(settings[0]._id);
    expect(updatedSettings).toHaveProperty("title", updates.title);
    expect(updatedSettings).toHaveProperty("description", updates.description);
  });

  it("should return updated settings", async () => {
    const updates = {
      title: "My Nodejs Blog",
      description: "My tutorials, tips and tricks about nodejs",
    };

    const updatedSettings = await settingsDb.updateSettings(updates);

    expect(updatedSettings).toHaveProperty("title", updates.title);
    expect(updatedSettings).toHaveProperty("description", updates.description);
  });
});

describe("getSettings", () => {
  let settings;

  beforeEach(async () => {
    settings = await Settings.insertMany([
      {
        title: "Site Title",
        keywords: ["nodejs", "coding", "tutorial"],
        favicon: "default_favicon.png",
        banner: "default_banner.jpg",
        copyright: "all rights are reserved for Me &copy; 2023",
        landingPage: true,
        isSiteDown: false,
        enableMembership: true,
      },
    ]);
  });

  afterEach(async () => {
    await Settings.deleteMany({});
  });

  it("should return all settings", async () => {
    const returnedSettings = await settingsDb.getSettings();
    expect(returnedSettings).toEqual(settings[0].toObject());
  });
});
