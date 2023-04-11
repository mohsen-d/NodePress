const usersSrv = require("../../../services/users.services");
const User = require("../../../models/user.model");

describe("excludePassword", () => {
  it("should exclude password from user object", () => {
    const user = new User({
      name: "foo bar",
      email: "foo@bar.com",
      password: "123456@Q",
    });

    const userWithoutPassword = usersSrv.excludePassword(user);
    expect(userWithoutPassword).not.toHaveProperty("password");
    expect(userWithoutPassword).toHaveProperty("name");
    expect(userWithoutPassword).toHaveProperty("email");
  });
});

describe("hashPassword", () => {
  it("should hash the given password", async () => {
    const password = "123456@W";
    const hashedPassword = await usersSrv.hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
    expect(hashedPassword.length).toBe(60);
  });
});
