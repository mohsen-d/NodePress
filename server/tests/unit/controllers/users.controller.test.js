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
  role: "user",
};

const userInstance = () => new User({ ...user });

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
    usersDb.getUsers.mockReturnValue([userInstance()]);
    await users.getUsers(req, res);
    expect(usersDb.getUsers).toHaveBeenCalled();
  });

  it("should return found users to client", async () => {
    usersDb.getUsers.mockReturnValue([userInstance()]);
    const result = await users.getUsers(req, res);
    expect(result.body[0]).toHaveProperty("name", user.name);
    expect(result.body[0]).toHaveProperty("email", user.email);
  });
});

describe("getUser", () => {
  mockDbMethod("getUser");

  req.baseUrl = "/admin";
  req.params = { id: 1 };

  it("should pass id to database layer", async () => {
    await users.getUser(req, res);
    expect(usersDb.getUser).toHaveBeenCalled();
  });

  it("should get id from req.user.id", async () => {
    req.baseUrl = "/user";
    req.user = { id: 2 };
    await users.getUser(req, res);
    expect(usersDb.getUser).toHaveBeenCalledWith(req.user.id);
  });

  it("should get id from req.params.id", async () => {
    await users.getUser(req, res);
    expect(usersDb.getUser).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no user", async () => {
    const result = await users.getUser(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the user if found", async () => {
    usersDb.getUser.mockReturnValue(userInstance());

    const result = await users.getUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("name", user.name);
    expect(result.body).toHaveProperty("email", user.email);
  });

  it("should not return the user's password", async () => {
    usersDb.getUser.mockReturnValue(userInstance());

    const result = await users.getUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).not.toHaveProperty("password");
  });
});

describe("updateUsers", () => {
  mockDbMethod("updateUsers");

  it("should only pass valid update fields to database", async () => {
    req.body = { ids: [1], isActive: true, isConfirmed: false, role: "admin" };
    await users.updateUsers(req, res);
    expect(usersDb.updateUsers).toHaveBeenCalledWith(req.body.ids, {
      isActive: true,
      isConfirmed: false,
    });
  });

  it("should return the number of updated users", async () => {
    usersDb.updateUsers.mockReturnValue(5);
    const result = await users.updateUsers(req, res);
    expect(result.body).toBe(5);
  });
});

describe("updateUser", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mockDbMethod("updateUser");
    mockDbMethod("getUser");
  });

  req.params = { id: 1 };

  it("should return with 404 error if id matches no user", async () => {
    usersDb.getUser.mockReturnValue(undefined);
    const result = await users.updateUser(req, res);
    expect(result.status).toBe(404);
  });

  it("should return with 400 error if input is invalid", async () => {
    req.body = { role: "invalid" };
    usersDb.getUser.mockReturnValue(userInstance());
    const result = await users.updateUser(req, res);
    expect(result.status).toBe(400);
  });

  it("should call usersServices.hashPassword if password is changed", async () => {
    hashPasswordFn = jest.spyOn(usersSrv, "hashPassword");
    req.body = { password: "pAss@123" };
    const returnValue = userInstance();
    usersDb.getUser.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    await users.updateUser(req, res);
    expect(hashPasswordFn).toHaveBeenCalledWith(req.body.password);
  });

  it("should pass changed user to database", async () => {
    req.body = { password: "pAss@123" };
    const returnValue = userInstance();
    usersDb.getUser.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    await users.updateUser(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should return updated user", async () => {
    req.body = { password: "pAss@123" };
    const returnValue = userInstance();
    usersDb.getUser.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    const result = await users.updateUser(req, res);
    expect(returnValue).toEqual(expect.objectContaining(result.body));
  });

  it("should not return updated user's password", async () => {
    req.body = { password: "pAss@123" };
    const returnValue = userInstance();
    usersDb.getUser.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    const result = await users.updateUser(req, res);
    expect(result.body).not.toHaveProperty("password");
  });
});

describe("deleteUsers", () => {
  mockDbMethod("deleteUsers");

  req.body = { ids: [1, 2, 3] };

  it("should pass ids to database layer", async () => {
    await users.deleteUsers(req, res);
    expect(usersDb.deleteUsers).toHaveBeenCalledWith(req.body.ids);
  });

  it("should return the number of deleted documents", async () => {
    usersDb.deleteUsers.mockReturnValue(3);
    const result = await users.deleteUsers(req, res);
    expect(result.body).toBe(3);
  });
});

describe("deleteUser", () => {
  mockDbMethod("deleteUser");

  req.params = { id: 1 };

  it("should pass id to database layer", async () => {
    await users.deleteUser(req, res);
    expect(usersDb.deleteUser).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no user", async () => {
    const result = await users.deleteUser(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the deleted user", async () => {
    usersDb.deleteUser.mockReturnValue(user);

    const result = await users.deleteUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(user);
  });
});

describe("deleteCurrentUser", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mockDbMethod("deleteCurrentUser");
    mockDbMethod("getUser");
    mockDbMethod("deleteUser");
    usersSrv.comparePasswords = jest.fn();

    req.user = { id: 1 };
    req.body = { password: "123" };
  });

  beforeEach(() => {
    usersSrv.comparePasswords.mockReturnValue(true);
    usersDb.getUser.mockReturnValue(user);
  });

  it("should return with 400 error if password is invalid", async () => {
    usersSrv.comparePasswords.mockReturnValue(false);

    const result = await users.deleteCurrentUser(req, res);
    expect(result.status).toBe(400);
  });

  it("should pass user to database to be deleted if password is valid", async () => {
    await users.deleteCurrentUser(req, res);
    expect(usersDb.deleteUser).toHaveBeenCalledWith(req.user.id);
  });

  it("should return true if user is deleted", async () => {
    usersDb.deleteUser.mockReturnValue(user);

    const result = await users.deleteCurrentUser(req, res);
    expect(result.body).toBe(true);
  });

  it("should return false if user is not deleted", async () => {
    usersDb.deleteUser.mockReturnValue(null);

    const result = await users.deleteCurrentUser(req, res);
    expect(result.body).toBe(false);
  });
});

describe("signIn", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mockDbMethod("getByEmail");
    mockDbMethod("updateUser");
    usersSrv.comparePasswords = jest.fn();

    req.body = { password: user.password, email: user.email };
  });

  it("should return with 400 error if email matches no user", async () => {
    const result = await users.signIn(req, res);
    expect(result.status).toBe(400);
  });

  it("should return with 400 error if password is invalid", async () => {
    usersDb.getByEmail.mockReturnValue(user);
    usersSrv.comparePasswords.mockReturnValue(false);

    const result = await users.signIn(req, res);
    expect(result.status).toBe(400);
  });

  it("should add new login to user.logins if signed in successfully", async () => {
    const user = userInstance();

    usersDb.getByEmail.mockReturnValue(user);
    usersSrv.comparePasswords.mockReturnValue(true);

    expect(user.logins.length).toBe(0);
    await users.signIn(req, res);
    expect(user.logins.length).toBe(1);
  });

  it("should update user if signed in successfully", async () => {
    const user = userInstance();

    usersDb.getByEmail.mockReturnValue(user);
    usersSrv.comparePasswords.mockReturnValue(true);

    await users.signIn(req, res);
    expect(usersDb.updateUser).toHaveBeenCalledWith(user);
  });

  it("should return a token if signed in successfully", async () => {
    const user = userInstance();

    usersDb.getByEmail.mockReturnValue(user);
    usersSrv.comparePasswords.mockReturnValue(true);

    const result = await users.signIn(req, res);
    expect(usersSrv.verifyToken(result.body)).not.toBe(false);
  });
});
