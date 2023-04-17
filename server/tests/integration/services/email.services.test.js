const emailSrv = require("../../../services/email.services");

describe("sendConfirmEmail", () => {
  it("should read config from env", () => {
    emailSrv.sendConfirmEmail("dorparasti@gmail.com", "123");
  });
});
