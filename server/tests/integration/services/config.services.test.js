const configSrv = require("../../../services/config.services");
const config = require("config");
const fs = require("fs");
const path = require("path");

jest.clearAllMocks();
const filePath = path.resolve(__dirname, "../../../../config/default.json");
const originalContent = fs.readFileSync(filePath, "utf-8");

afterAll(() => {
  fs.writeFileSync(filePath, originalContent);
});

describe("integration", () => {
  describe("updateConfigFields", () => {
    it("should rewrite config file with updated data", () => {
      config.mail.host = undefined;
      config.mail.port = undefined;

      configSrv.updateConfigFields({
        mail: {
          host: "mail.com",
          port: 900,
          username: "name",
        },
      });

      const fileContent = fs.readFileSync(filePath, "utf-8");

      const content = JSON.parse(fileContent);

      expect(content.mail.host).toBe("mail.com");
      expect(content.mail.port).toBe(900);
      expect(content.mail.username).not.toBe("name");
    });
  });
});
