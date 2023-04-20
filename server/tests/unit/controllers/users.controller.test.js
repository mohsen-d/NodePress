const users = require("../../../controllers/users.controller");
const usersDb = require("../../../database/users.db");
const usersSrv = require("../../../services/users.services");
const emailSrv = require("../../../services/email.services");
const User = require("../../../models/user.model");
const mongoose = require("mongoose");

let req;
let res;
let user;
let userInstance;

beforeAll(() => {
  req = { user: { isAuthenticated: true } };

  res = {
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

  user = {
    name: "firstname familyname",
    email: "foo@bar.com",
    password: "123456#Q",
    role: "user",
  };

  userInstance = () => new User({ ...user });
});

function mockMethods() {
  jest.clearAllMocks();
  Object.keys(usersDb).forEach((m) => (usersDb[m] = jest.fn()));
  Object.keys(emailSrv).forEach((m) => (emailSrv[m] = jest.fn()));
}

describe("addUser", () => {
  beforeAll(() => {
    mockMethods();
  });

  beforeEach(() => {
    req.body = { ...user };
    usersDb.emailExists.mockReturnValue(false);
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
    const result = await users.addUser(req, res);
    expect(usersDb.addUser).toHaveBeenCalled();
  });

  it("should return the inserted user", async () => {
    const result = await users.addUser(req, res);

    expect(result.body).toHaveProperty("name", user.name);
    expect(result.body).toHaveProperty("email", user.email);
  });

  it("should not return the new user's password", async () => {
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
  beforeAll(() => {
    mockMethods();
    usersDb.getUsers.mockReturnValue([userInstance()]);
  });

  it("should get users from database layer", async () => {
    await users.getUsers(req, res);
    expect(usersDb.getUsers).toHaveBeenCalled();
  });

  it("should return found users to client", async () => {
    const result = await users.getUsers(req, res);
    expect(result.body[0]).toHaveProperty("name", user.name);
    expect(result.body[0]).toHaveProperty("email", user.email);
  });
});

describe("getUser", () => {
  beforeAll(() => {
    mockMethods();

    req.baseUrl = "/admin";
    req.params = { id: 1 };
  });

  beforeEach(() => {
    usersDb.getUser.mockReturnValue(userInstance());
  });

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
    usersDb.getUser.mockReturnValue(null);

    const result = await users.getUser(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the user if found", async () => {
    const result = await users.getUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("name", user.name);
    expect(result.body).toHaveProperty("email", user.email);
  });

  it("should not return the user's password", async () => {
    const result = await users.getUser(req, res);

    expect(result.status).toBe(200);
    expect(result.body).not.toHaveProperty("password");
  });
});

describe("updateUsers", () => {
  beforeAll(() => {
    mockMethods();
  });

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
    mockMethods();
    req.params = { id: 1 };
  });

  beforeEach(() => {
    const returnValue = userInstance();
    usersDb.getUser.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    req.body = { role: "admin" };
  });

  it("should return with 404 error if id matches no user", async () => {
    usersDb.getUser.mockReturnValue(undefined);
    const result = await users.updateUser(req, res);
    expect(result.status).toBe(404);
  });

  it("should return with 400 error if input is invalid", async () => {
    req.body = { role: "invalid" };

    const result = await users.updateUser(req, res);
    expect(result.status).toBe(400);
  });

  it("should call usersServices.hashPassword if password is changed", async () => {
    hashPasswordFn = jest.spyOn(usersSrv, "hashPassword");
    req.body = { password: "pAss@123" };
    await users.updateUser(req, res);
    expect(hashPasswordFn).toHaveBeenCalledWith(req.body.password);
  });

  it("should pass changed user to database", async () => {
    await users.updateUser(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should return updated user", async () => {
    const result = await users.updateUser(req, res);
    expect(result.body.role).toBe("admin");
  });

  it("should not return updated user's password", async () => {
    const result = await users.updateUser(req, res);
    expect(result.body).not.toHaveProperty("password");
  });
});

describe("deleteUsers", () => {
  beforeAll(() => {
    mockMethods();
    req.body = { ids: [1, 2, 3] };
  });

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
  beforeAll(() => {
    mockMethods();
    req.params = { id: 1 };
  });

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
    mockMethods();

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
    mockMethods();
    usersSrv.comparePasswords = jest.fn();

    req.body = { password: user.password, email: user.email };
  });

  beforeEach(() => {
    usersDb.getByEmail.mockReturnValue(userInstance());
    usersSrv.comparePasswords.mockReturnValue(true);
  });

  it("should return with 400 error if email matches no user", async () => {
    usersDb.getByEmail.mockReturnValue(null);

    const result = await users.signIn(req, res);
    expect(result.status).toBe(400);
  });

  it("should return with 400 error if password is invalid", async () => {
    usersSrv.comparePasswords.mockReturnValue(false);

    const result = await users.signIn(req, res);
    expect(result.status).toBe(400);
  });

  it("should add new login to user.logins if signed in successfully", async () => {
    await users.signIn(req, res);
    const updatedUser =
      usersDb.updateUser.mock.calls[
        usersDb.updateUser.mock.calls.length - 1
      ][0];
    expect(updatedUser.logins.length).toBe(1);
  });

  it("should update user if signed in successfully", async () => {
    await users.signIn(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should return a token if signed in successfully", async () => {
    const result = await users.signIn(req, res);
    expect(usersSrv.verifyToken(result.body)).not.toBe(false);
  });
});

describe("signup", () => {
  beforeAll(() => {
    mockMethods();
    hashPasswordFn = jest.spyOn(usersSrv, "hashPassword");
  });

  beforeEach(() => {
    req.body = { ...user };
    usersDb.emailExists.mockReturnValue(false);
    usersDb.addUser.mockReturnValue(userInstance());
  });

  it("should return with 400 error if input is invalid", async () => {
    req.body.name = undefined;
    const result = await users.signUp(req, res);
    expect(result.status).toBe(400);
    expect(result.body["name"]).not.toBeUndefined;
  });

  it("should return with 400 error if email already exists", async () => {
    usersDb.emailExists.mockReturnValue(true);
    const result = await users.signUp(req, res);
    expect(result.status).toBe(400);
  });

  it("should hash user's password", async () => {
    await users.signUp(req, res);
    expect(hashPasswordFn).toHaveBeenCalledWith(req.body.password);
  });

  it("should pass new user to database to be saved", async () => {
    await users.signUp(req, res);
    expect(usersDb.addUser).toHaveBeenCalled();
  });

  it("should call email service to send confirm email", async () => {
    await users.signUp(req, res);

    expect(emailSrv.sendConfirmEmail).toHaveBeenCalled();
  });

  it("should return true after user is added successfully", async () => {
    const result = await users.signUp(req, res);
    expect(result.body).toBe(true);
  });

  it("should return false if adding new user fails", async () => {
    usersDb.addUser.mockReturnValue(null);

    const result = await users.signUp(req, res);
    expect(result.body).toBe(false);
  });
});

describe("updateCurrentUserPassword", () => {
  beforeAll(() => {
    mockMethods();
    usersSrv.comparePasswords = jest.fn();
    hashPasswordFn = jest.spyOn(usersSrv, "hashPassword");
  });

  beforeEach(() => {
    req.user = { id: 1 };
    req.body = { currentPassword: user.password, newPassword: "123456&V" };
  });

  it("should return with 400 error if current password is invalid", async () => {
    usersDb.getUser.mockReturnValue(userInstance());
    usersSrv.comparePasswords.mockReturnValue(false);
    const result = await users.changeCurrentUserPassword(req, res);
    expect(result.status).toBe(400);
  });

  it("should return with 400 error if new password is invalid", async () => {
    usersDb.getUser.mockReturnValue(userInstance());
    usersSrv.comparePasswords.mockReturnValue(true);
    req.body.newPassword = "123";
    const result = await users.changeCurrentUserPassword(req, res);
    expect(result.status).toBe(400);
  });

  it("should hash the new password", async () => {
    usersDb.getUser.mockReturnValue(userInstance());
    usersSrv.comparePasswords.mockReturnValue(true);
    await users.changeCurrentUserPassword(req, res);
    expect(hashPasswordFn).toHaveBeenCalledWith(req.body.newPassword);
  });

  it("should pass user with new password to database", async () => {
    usersDb.getUser.mockReturnValue(userInstance());
    usersSrv.comparePasswords.mockReturnValue(true);
    await users.changeCurrentUserPassword(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should return true after user is updated", async () => {
    usersDb.getUser.mockReturnValue(userInstance());
    usersSrv.comparePasswords.mockReturnValue(true);
    const result = await users.changeCurrentUserPassword(req, res);
    expect(result.body).toBe(true);
  });
});

describe("updateCurrentUserName", () => {
  beforeAll(() => {
    mockMethods();
  });

  beforeEach(() => {
    req.user = { id: 1 };
    req.body = { name: "new name" };
  });

  it("should return with 400 error if new name is invalid", async () => {
    req.body.name = undefined;
    usersDb.getUser.mockReturnValue(userInstance());

    const result = await users.changeCurrentUserName(req, res);
    expect(result.status).toBe(400);
  });

  it("should pass user with new name to database", async () => {
    const returnValue = userInstance();
    usersDb.getUser.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);

    await users.changeCurrentUserName(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should return updated user", async () => {
    const user = userInstance();
    usersDb.getUser.mockReturnValue(user);
    usersDb.updateUser.mockReturnValue(user);

    const result = await users.changeCurrentUserName(req, res);
    expect(result.body).toHaveProperty("name", req.body.name);
  });
});

describe("confirm", () => {
  beforeAll(() => {
    mockMethods();
    emailSrv.sendAccountStatusEmail = jest.fn();
    req.params = { token: 1 };
  });

  it("should return with 404 error if token matches no user", async () => {
    usersDb.getByToken.mockReturnValue(undefined);
    const result = await users.confirm(req, res);
    expect(result.status).toBe(404);
  });

  it("should pass changed user to database", async () => {
    const returnValue = userInstance();
    usersDb.getByToken.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    await users.confirm(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should set user.isConfirmed to true and user.token to undefined", async () => {
    const returnValue = userInstance();

    returnValue.isConfirmed = false;
    returnValue.token = returnValue._id;

    usersDb.getByToken.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);

    await users.confirm(req, res);

    expect(returnValue.isConfirmed).toBe(true);
    expect(returnValue.token).toBe(undefined);
  });

  it("should return true if confirmed successfully", async () => {
    const returnValue = userInstance();
    usersDb.getByToken.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    const result = await users.confirm(req, res);
    expect(result.body).toBe(true);
  });

  it("should send email to user if confirmed successfully", async () => {
    const returnValue = userInstance();
    usersDb.getByToken.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    await users.confirm(req, res);
    expect(emailSrv.sendAccountStatusEmail).toHaveBeenCalled();
  });

  it("should return false if confirm failed", async () => {
    const returnValue = userInstance();
    usersDb.getByToken.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(null);
    const result = await users.confirm(req, res);
    expect(result.body).toBe(false);
  });
});

describe("sendPasswordRecoveryEmail", () => {
  beforeAll(() => {
    mockMethods();
    req.params = { email: "w@q.c" };
  });

  it("should return with 404 error if email matches no user", async () => {
    usersDb.getByEmail.mockReturnValue(null);
    const result = await users.sendPasswordRecoveryEmail(req, res);
    expect(result.status).toBe(404);
  });

  it("should set user.token field", async () => {
    const returnValue = userInstance();

    usersDb.getByEmail.mockReturnValue(returnValue);

    expect(returnValue.token).toBeUndefined();
    await users.sendPasswordRecoveryEmail(req, res);
    expect(returnValue.token).not.toBeUndefined();
  });

  it("should pass changed user to database", async () => {
    const returnValue = userInstance();
    usersDb.getByEmail.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    await users.sendPasswordRecoveryEmail(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should return true if user updated successfully", async () => {
    const returnValue = userInstance();
    usersDb.getByEmail.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    const result = await users.sendPasswordRecoveryEmail(req, res);
    expect(result.body).toBe(true);
  });

  it("should send recovery email to user after user updated successfully", async () => {
    const returnValue = userInstance();
    usersDb.getByEmail.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(returnValue);
    await users.sendPasswordRecoveryEmail(req, res);
    expect(emailSrv.sendPasswordRecoveryEmail).toHaveBeenCalled();
  });

  it("should return false if failed to update user", async () => {
    const returnValue = userInstance();
    usersDb.getByEmail.mockReturnValue(returnValue);
    usersDb.updateUser.mockReturnValue(null);
    const result = await users.sendPasswordRecoveryEmail(req, res);
    expect(result.body).toBe(false);
  });
});

describe("recoverPassword", () => {
  let userToBeRecovered;

  beforeAll(() => {
    mockMethods();
    hashPasswordFn = jest.spyOn(usersSrv, "hashPassword");
  });

  beforeEach(() => {
    req.params = { email: "w@q.c" };
    req.body = {
      token: new mongoose.Types.ObjectId().toHexString(),
      password: "123#45Pt",
    };
  });

  function createUserToBeUpdated(token = new mongoose.Types.ObjectId()) {
    userToBeRecovered = userInstance();
    userToBeRecovered.token = token;
    usersDb.getByEmail.mockReturnValue(userToBeRecovered);
    usersDb.updateUser.mockReturnValue(userToBeRecovered);
  }

  it("should return with 404 error if email matches no user", async () => {
    usersDb.getByEmail.mockReturnValue(null);
    const result = await users.recoverPassword(req, res);
    expect(result.status).toBe(404);
  });

  it("should return with 400 error if user.token is undefined/empty", async () => {
    createUserToBeUpdated(undefined);
    const result = await users.recoverPassword(req, res);
    expect(result.status).toBe(400);
  });

  it("should return with 400 error if req.body.token undefined/empty", async () => {
    delete req.body.token;
    createUserToBeUpdated();
    const result = await users.recoverPassword(req, res);
    expect(result.status).toBe(400);
  });

  it("should return with 400 error if user.token does not match req.body.token", async () => {
    createUserToBeUpdated();
    const result = await users.recoverPassword(req, res);
    expect(result.status).toBe(400);
  });

  it("should return with 400 error if new password is invalid", async () => {
    req.body.password = "123";
    createUserToBeUpdated(req.body.token);

    const result = await users.recoverPassword(req, res);
    expect(result.status).toBe(400);
  });

  it("should hash new password", async () => {
    createUserToBeUpdated(req.body.token);

    await users.recoverPassword(req, res);
    expect(usersSrv.hashPassword).toHaveBeenCalledWith(req.body.password);
  });

  it("should pass changed user to database", async () => {
    createUserToBeUpdated(req.body.token);

    await users.recoverPassword(req, res);
    expect(usersDb.updateUser).toHaveBeenCalled();
  });

  it("should set user.token to undefined", async () => {
    createUserToBeUpdated(req.body.token);

    await users.recoverPassword(req, res);

    expect(userToBeRecovered.token).toBe(undefined);
  });

  it("should return true if user updated successfully after password recovery", async () => {
    createUserToBeUpdated(req.body.token);

    const result = await users.recoverPassword(req, res);
    expect(result.body).toBe(true);
  });

  it("should send email to user if password recovery done successfully", async () => {
    createUserToBeUpdated(req.body.token);

    await users.recoverPassword(req, res);
    expect(emailSrv.sendAccountStatusEmail).toHaveBeenCalled();
  });

  it("should return false if failed to update user with new password", async () => {
    createUserToBeUpdated(req.body.token);
    usersDb.updateUser.mockReturnValue(null);
    const result = await users.recoverPassword(req, res);
    expect(result.body).toBe(false);
  });
});
