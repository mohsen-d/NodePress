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

describe("excludePasswords", () => {
  it("should exclude password from users list", () => {
    const user1 = new User({
      name: "foo bar",
      email: "foo@bar.com",
      password: "123456@Q",
    });

    const user2 = new User({
      name: "foo bar 2",
      email: "foo2@bar.com",
      password: "1#abcdef",
    });

    const usersWithoutPassword = usersSrv.excludePasswords([user1, user2]);
    expect(usersWithoutPassword[0]).not.toHaveProperty("password");
    expect(usersWithoutPassword[0]).toHaveProperty("name");
    expect(usersWithoutPassword[0]).toHaveProperty("email");

    expect(usersWithoutPassword[1]).not.toHaveProperty("password");
    expect(usersWithoutPassword[1]).toHaveProperty("name");
    expect(usersWithoutPassword[1]).toHaveProperty("email");
  });

  it("should return empty array if users list is empty", () => {
    const usersWithoutPassword = usersSrv.excludePasswords([]);
    expect(usersWithoutPassword.length).toBe(0);
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
