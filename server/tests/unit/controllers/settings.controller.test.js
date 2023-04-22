const settings = require("../../../controllers/settings.controller");
const Settings = require("../../../models/settings.model");
const settingsDb = require("../../../database/settings.db");

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

describe("updateSettings", () => {
  settingsDb.updateSettings = jest.fn();

  beforeEach(() => {
    req.body = { title: "new title", landingPage: true };
  });

  it("should return 400 error if data is invalid", async () => {
    req.body.title = "   ";
    const result = await settings.updateSettings(req, res);
    expect(result.status).toBe(400);
  });

  it("should pass valid settings to database layer to be updated", async () => {
    await settings.updateSettings(req, res);
    expect(settingsDb.updateSettings).toHaveBeenCalled();
  });

  it("should return updated settings", async () => {
    const updateSettings = new Settings(req.body);
    settingsDb.updateSettings.mockReturnValue(updateSettings);
    const result = await settings.updateSettings(req, res);
    expect(result.body).toEqual(updateSettings);
  });
});
