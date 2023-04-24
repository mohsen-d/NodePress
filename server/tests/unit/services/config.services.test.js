const configSrv = require("../../../services/config.services");
let config = require("config");
const fs = require("fs");

const originalConfig = { ...config };

afterAll(() => {
  config = originalConfig;
});

describe("getUndefinedFields", () => {
  it("should only return fields with undefined value", () => {
    config.domain = "undefined";
    const result = configSrv.getUndefinedFields();
    expect(result).toHaveProperty("domain");
  });

  it("should check nested fields", () => {
    config.mail.host = "undefined";
    const result = configSrv.getUndefinedFields();
    expect(result).toHaveProperty("mail.host");
  });
});

describe("updateConfigFields", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.writeFileSync = jest.fn();
    fs.readFileSync = jest.fn();
    fs.readFileSync.mockReturnValue(
      '{ "domain": "undefined", "mail":{"host": "undefined", "port":"undefined"} }'
    );
  });

  it("should only update undefined fields", () => {
    config.domain = undefined;
    const database = config.database;
    configSrv.updateConfigFields({
      domain: "nodepress.com",
      database: "database",
    });

    expect(config.domain).toBe("nodepress.com");
    expect(config.database).not.toBe("database");
    expect(config.database).toBe(database);
  });

  it("should update nested undefined fields", () => {
    config.mail.host = undefined;
    const port = config.mail.port;
    configSrv.updateConfigFields({
      mail: {
        host: "mail.com",
        port: 900,
      },
    });

    expect(config.mail.host).toBe("mail.com");
    expect(config.mail.port).not.toBe(900);
    expect(config.mail.port).toBe(port);
  });

  it("should rewrite config file with updated data", () => {
    configSrv.updateConfigFields({
      mail: {
        host: "mail.com",
        port: 900,
      },
    });

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it("should not rewrite config file if there is no changes", () => {
    configSrv.updateConfigFields({});

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
