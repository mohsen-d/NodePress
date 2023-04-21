const config = require("config");
const settingsDb = require("../../../database/settings.db");
const Settings = require("../../../models/settings.model");

it("should load settings and add them to config", async () => {
  settingsDb.getSettings = jest.fn();
  settingsDb.getSettings.mockReturnValue(new Settings());

  await require("../../../startup/settings.startup")();

  expect(config).toHaveProperty("title", "Site Title");
});
