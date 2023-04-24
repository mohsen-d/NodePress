const configController = require("../../../controllers/config.controller");
const configSrv = require("../../../services/config.services");

const req = { body: {} };

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

describe("updateConfig", () => {
  it("should return with 400 error if input is invalid", () => {
    req.body = { database: true };
    const result = configController.updateConfig(req, res);

    expect(result.status).toBe(400);
  });

  it("should pass values to config.services to be saved", () => {
    configSrv.updateConfigFields = jest.fn();

    req.body = { database: "database" };
    configController.updateConfig(req, res);

    expect(configSrv.updateConfigFields).toHaveBeenCalledWith(req.body);
  });

  it("should return true after updating config", () => {
    configSrv.updateConfigFields = jest.fn();

    req.body = { database: "database" };
    const result = configController.updateConfig(req, res);

    expect(result.body).toBe(true);
  });
});
