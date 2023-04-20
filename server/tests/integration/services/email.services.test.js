const emailSrv = require("../../../services/email.services");

describe("sendEmail", () => {
  it("should return an object containing messageId after successful sending", async () => {
    const result = await emailSrv.sendEmail(
      "foo@domain.com",
      "test email",
      "testing email service"
    );

    expect(result.error).toBeUndefined();
    expect(result.messageId).not.toBeUndefined();
  }, 10000);

  it("should return object containing error if failed sending email", async () => {
    const result = await emailSrv.sendEmail(
      undefined,
      "test email",
      "testing email service"
    );

    expect(result.error).not.toBeUndefined();
    expect(result.messageId).toBeUndefined();
  }, 10000);

  it("should work when 'to' is an array of emails", async () => {
    const result = await emailSrv.sendEmail(
      ["foo@domain.com", "bar@domain.com"],
      "test email",
      "testing email service"
    );

    console.log(result);
    expect(result.error).toBeUndefined();
    expect(result.messageId).not.toBeUndefined();
  }, 10000);
});
