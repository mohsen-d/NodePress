const users = require("../../../controllers/users.controller");
const usersDb = require("../../../database/users.db");
const usersSrv = require("../../../services/users.services");
const User = require("../../../models/user.model");

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

describe("getUsers", () => {
  mockDbMethod("getUsers");

  it("should get users from database layer", async () => {
    usersDb.getUsers.mockReturnValue([new User({ ...user })]);
    await users.getUsers(req, res);
    expect(usersDb.getUsers).toHaveBeenCalled();
  });

  it("should return found users to client", async () => {
    usersDb.getUsers.mockReturnValue([new User({ ...user })]);
    const result = await users.getUsers(req, res);
    expect(result.body[0]).toHaveProperty("name", user.name);
    expect(result.body[0]).toHaveProperty("email", user.email);
  });
});

describe("getUser", () => {
  mockDbMethod("getUser");

  req.params = { id: 1 };

  it("should pass id to database layer", async () => {
    await users.getUser(req, res);
    expect(usersDb.getUser).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no user", async () => {
    const result = await users.getUser(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the user if found", async () => {
    usersDb.getUser.mockReturnValue(new User({ ...user }));

    const result = await users.getUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("name", user.name);
    expect(result.body).toHaveProperty("email", user.email);
  });

  it("should not return the user's password", async () => {
    usersDb.getUser.mockReturnValue(new User({ ...user }));

    const result = await users.getUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).not.toHaveProperty("password");
  });
});
