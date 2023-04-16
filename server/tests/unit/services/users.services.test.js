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

  it("should return empty string for non-string inputs", async () => {
    expect(await usersSrv.hashPassword(0)).toBe("");
    expect(await usersSrv.hashPassword(undefined)).toBe("");
    expect(await usersSrv.hashPassword(null)).toBe("");
    expect(await usersSrv.hashPassword(true)).toBe("");
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

describe("comparePasswords", () => {
  it("should return true if passwords match", async () => {
    const password = "Q123456$";
    const hashedPassword = await usersSrv.hashPassword(password);
    const result = await usersSrv.comparePasswords(password, hashedPassword);
    expect(result).toBe(true);
  });

  it("should return false if passwords don't match", async () => {
    const hashedPassword = await usersSrv.hashPassword("Q123456$");
    const result = await usersSrv.comparePasswords("123456", hashedPassword);
    expect(result).toBe(false);
  });

  it("should return false if passwords are invalid", async () => {
    const hashedPassword = await usersSrv.hashPassword("Q123456$");
    const result = await usersSrv.comparePasswords(123456, hashedPassword);
    expect(result).toBe(false);
  });
});

describe("verifyToken", () => {
  it("should return false if token is invalid", () => {
    let result = usersSrv.verifyToken("invalid token");
    expect(result).toBe(false);

    result = usersSrv.verifyToken(false);
    expect(result).toBe(false);
  });

  it("should return decoded token if valid", () => {
    const token = new User({
      name: "name",
      email: "s@w.c",
      password: "1234567@W",
    }).generateAuthToken();

    const result = usersSrv.verifyToken(token);
    expect(result).not.toBe(false);
    expect(result).toHaveProperty("_id");
    expect(result).toHaveProperty("role");
  });
});

describe("buildGetFilter", () => {
  it("should use the sent value for _id, isActive and isConfirmed", () => {
    const id = new Array(25).join(1);
    const filter = usersSrv.buildGetFilter({
      _id: id,
      isActive: true,
      isConfirmed: false,
    });

    expect(filter).toHaveProperty("_id", id);
    expect(filter).toHaveProperty("isActive", true);
    expect(filter).toHaveProperty("isConfirmed", false);
  });

  it("should use regex for string props", () => {
    const filter = usersSrv.buildGetFilter({
      name: "name",
      email: "q@w.c",
      role: "user",
      source: "local",
    });

    expect(filter).toHaveProperty("name", /name/i);
    expect(filter).toHaveProperty("email", /q@w.c/i);
    expect(filter).toHaveProperty("role", /user/i);
    expect(filter).toHaveProperty("source", /local/i);
  });

  it("should use $gte and $lte for createdAt", () => {
    const filter = usersSrv.buildGetFilter({
      createdAt: { from: "12/12/2022", to: "12/12/2022" },
    });
    expect(filter).toHaveProperty("createdAt", {
      $gte: "12/12/2022",
      $lte: "12/12/2022",
    });
  });

  it("should return empty object if an empty object is provided", () => {
    const filter = usersSrv.buildGetFilter({});
    expect(filter).toEqual({});
  });

  it("should return empty object if no parameter is provided", () => {
    const filter = usersSrv.buildGetFilter();
    expect(filter).toEqual({});
  });

  it("should skip parameter if value is undefined or null", () => {
    const filter = usersSrv.buildGetFilter({
      _id: undefined,
      name: null,
      isActive: true,
    });

    expect(filter).toHaveProperty("isActive", true);
    expect(filter).not.toHaveProperty("_id");
    expect(filter).not.toHaveProperty("name");
  });

  it("should skip parameter if value is invalid", () => {
    const filter = usersSrv.buildGetFilter({
      _id: 1,
      role: "",
      createdAt: 2,
      isConfirmed: true,
    });

    expect(filter).toHaveProperty("isConfirmed", true);
    expect(filter).not.toHaveProperty("_id");
    expect(filter).not.toHaveProperty("role");
    expect(filter).not.toHaveProperty("createdAt");
  });

  it("should truncate string parameters longer than 50 characters instead of deleting them", () => {
    const filter = usersSrv.buildGetFilter({
      name: new Array(55).join("a"),
    });

    expect(filter).toHaveProperty(
      "name",
      new RegExp(new Array(51).join("a"), "i")
    );
  });
});

describe("buildGetOptions", () => {
  const options = {
    sort: { createdAt: -1 },
    limit: 10,
    skip: 0,
  };

  it("should return default values if empty object is passed", () => {
    const result = usersSrv.buildGetOptions({});
    expect(result).toEqual(options);
  });

  it("should return default values if no parameter is passed", () => {
    const result = usersSrv.buildGetOptions();
    expect(result).toEqual(options);
  });

  it("should return default values if invalid values are sent", () => {
    const result = usersSrv.buildGetOptions({
      sort: { by: "createdAt", order: true },
      pageSize: "a",
      page: "a",
    });

    expect(result).toHaveProperty("sort", { createdAt: -1 });
    expect(result).toHaveProperty("limit", 10);
    expect(result).toHaveProperty("skip", 0);
  });

  it("should return default value if out-of-range values are sent", () => {
    const result = usersSrv.buildGetOptions({
      sort: { by: "name", order: 2 },
      pageSize: 1000,
      page: 5000,
    });

    expect(result).toHaveProperty("sort", { createdAt: -1 });
    expect(result).toHaveProperty("limit", 10);
    expect(result).toHaveProperty("skip", 0);
  });

  it("should set options if parameters are valid", () => {
    const result = usersSrv.buildGetOptions({
      pageSize: 25,
      page: 2,
      sort: { by: "name", order: 1 },
    });
    expect(result).toHaveProperty("sort", { name: 1 });
    expect(result).toHaveProperty("limit", 25);
    expect(result).toHaveProperty("skip", 25);
  });

  it("should not reject numeric values sent in string as invalid", () => {
    const result = usersSrv.buildGetOptions({
      pageSize: "15",
      page: "3",
      sort: { by: "name", order: "-1" },
    });
    expect(result).toHaveProperty("sort", { name: -1 });
    expect(result).toHaveProperty("limit", 15);
    expect(result).toHaveProperty("skip", 30);
  });
});
