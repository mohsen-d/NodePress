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

describe("buildUpdateCommand", () => {
  it("should only pick isActive and isConfirmed fields", () => {
    const result = usersSrv.buildUpdateCommand({
      a: 1,
      b: 2,
      isActive: true,
      isConfirmed: false,
    });
    expect(result).toHaveProperty("isActive", true);
    expect(result).toHaveProperty("isConfirmed", false);
    expect(result).not.toHaveProperty("a");
    expect(result).not.toHaveProperty("b");
  });

  it("should ignore invalid isActive and isConfirmed fields", () => {
    const result = usersSrv.buildUpdateCommand({
      a: 1,
      b: 2,
      isActive: "a",
      isConfirmed: false,
    });
    expect(result).toHaveProperty("isConfirmed", false);
    expect(result).not.toHaveProperty("isActive");
    expect(result).not.toHaveProperty("a");
    expect(result).not.toHaveProperty("b");
  });
});

describe("filterUpdateFields", () => {
  it("should return allowed fields", () => {
    const fields = {
      name: "name",
      email: "w@e.r",
      password: "123",
      isActive: true,
      isConfirmed: true,
      _id: 1,
    };

    const result = usersSrv.filterUpdateFields(fields);

    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("_id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("password");
    expect(result).toHaveProperty("isActive");
    expect(result).toHaveProperty("isConfirmed");
  });

  it("should not return an allowed field if it is not included in the input", () => {
    const fields = {
      email: "w@e.r",
      password: "123",
      isActive: true,
      _id: 1,
    };

    const result = usersSrv.filterUpdateFields(fields);

    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("_id");
    expect(result).not.toHaveProperty("name");
    expect(result).toHaveProperty("password");
    expect(result).toHaveProperty("isActive");
    expect(result).not.toHaveProperty("isConfirmed");
  });
});
