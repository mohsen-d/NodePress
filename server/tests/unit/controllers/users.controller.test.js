const users = require("../../../controllers/users.controller");
const usersDb = require("../../../database/users.db");
const usersSrv = require("../../../services/users.services");

const req = { user: { isAuthenticated: true } };

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

const user = {
  name: "firstname familyname",
  email: "foo@bar.com",
  password: "123456#Q",
};

function mockDbMethod(method) {
  usersDb[method] = jest.fn();
}

describe("addUser", () => {
  mockDbMethod("addUser");
  mockDbMethod("emailExists");

  beforeEach(() => {
    req.body = { ...user };
  });

  it("should return with error code 400 if new user is invalid", async () => {
    req.body.name = undefined;
    const result = await users.addUser(req, res);
    expect(result.status).toBe(400);
    expect(result.body["name"]).not.toBeUndefined;
  });

  it("should return with error code 400 if email already exists", async () => {
    usersDb.emailExists.mockReturnValue(true);
    const result = await users.addUser(req, res);
    expect(result.status).toBe(400);
    expect(result.body["name"]).not.toBeUndefined;
  });

  it("should pass valid new user to database layer", async () => {
    usersDb.emailExists.mockReturnValue(false);
    const result = await users.addUser(req, res);
    expect(usersDb.addUser).toHaveBeenCalled();
  });

  it("should return the inserted user", async () => {
    usersDb.emailExists.mockReturnValue(false);

    const result = await users.addUser(req, res);

    expect(result.body).toHaveProperty("name", user.name);
    expect(result.body).toHaveProperty("email", user.email);
  });

  it("should not return the new user's password", async () => {
    usersDb.emailExists.mockReturnValue(false);

    const result = await users.addUser(req, res);
    expect(result.body).not.toHaveProperty("password");
  });

  it("should call usersServices.hashPassword", async () => {
    hashPasswordFn = jest.spyOn(usersSrv, "hashPassword");

    await users.addUser(req, res);
    expect(hashPasswordFn).toHaveBeenCalledWith(user.password);
  });
});
