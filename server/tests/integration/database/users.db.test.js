const usersDb = require("../../../database/users.db");
const User = require("../../../models/user.model");
const mongoose = require("mongoose");
require("../../../startup/db")();

afterAll(() => {
  mongoose.disconnect();
});

describe("addUser", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  async function exec() {
    return await usersDb.addUser(
      new User({
        name: "name",
        email: "a@d.v",
        password: "123Wqq#!",
      })
    );
  }

  it("should save user to the database", async () => {
    await exec();

    const user = await User.find({ name: "name" });

    expect(user).not.toBeNull();
  });

  it("should return saved user", async () => {
    const user = await exec();

    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("name", "name");
  });
});

describe("getByEmail", () => {
  let user1 = {
    name: "active",
    email: "e@m.i",
    password: "1234@Wer",
    isActive: true,
    isConfirmed: true,
  };
  let user2 = {
    name: "inactive",
    email: "e2@m.i",
    password: "1234@Wer",
  };

  beforeAll(async () => {
    await User.insertMany([user1, user2]);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return user with given email", async () => {
    const result = await usersDb.getByEmail(user1.email);

    expect(result).not.toBeUndefined();
    expect(result.name).toBe("active");
  });

  it("should not return user if it's not active or not confirmed", async () => {
    const result = await usersDb.getByEmail(user2.email);

    expect(result).toBeNull();
  });
});

describe("emailExists", () => {
  let user = {
    name: "active",
    email: "e@m.i",
    password: "1234@Wer",
    isActive: true,
    isConfirmed: true,
  };

  beforeAll(async () => {
    await User.insertMany([user]);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return true if email exists", async () => {
    const result = await usersDb.emailExists(user.email);

    expect(result).toBe(true);
  });

  it("should return false if email does not exist", async () => {
    const result = await usersDb.emailExists("new@mail.com");

    expect(result).toBe(false);
  });
});

describe("updateUser", () => {
  let users;

  beforeEach(async () => {
    users = await User.insertMany([
      { name: "name", email: "e@m.i", password: "1234@Wer" },
    ]);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should update the user with given id", async () => {
    users[0].name = "new name";
    users[0].isActive = true;

    await usersDb.updateUser(users[0]);

    const updatedUser = await User.findById(users[0]._id);
    expect(updatedUser).toHaveProperty("name", "new name");
    expect(updatedUser).toHaveProperty("isActive", true);
    expect(updatedUser).toHaveProperty("isConfirmed", false);
  });

  it("should return null if given id match no user", async () => {
    users[0]._id = new mongoose.Types.ObjectId();
    users[0].name = "another name";

    const updatedUser = await usersDb.updateUser(users[0]);

    expect(updatedUser).toBeNull();
  });
});

describe("deleteUsers", () => {
  let users;

  beforeEach(async () => {
    users = await User.insertMany([
      {
        name: "first name",
        email: "a1@d.v",
        password: "123Wqq#!",
      },
      {
        name: "second name",
        email: "a2@d.v",
        password: "123Wqq#!",
      },
      {
        name: "third name",
        email: "a3@d.v",
        password: "123Wqq#!",
      },
    ]);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should delete users with given ids", async () => {
    const deletedCount = await usersDb.deleteUsers([users[0]._id]);
    expect(deletedCount).toBe(1);
    const remaining = await User.find();
    expect(remaining.length).toBe(2);
  });

  it("should return 0 if given ids match no user", async () => {
    const id = new mongoose.Types.ObjectId();
    const deletedCount = await usersDb.deleteUsers([id]);
    expect(deletedCount).toBe(0);
    const remaining = await User.find();
    expect(remaining.length).toBe(3);
  });
});

describe("deleteUser", () => {
  let users;

  beforeEach(async () => {
    users = await User.insertMany([
      {
        name: "first name",
        email: "a1@d.v",
        password: "123Wqq#!",
      },
      {
        name: "second name",
        email: "a2@d.v",
        password: "123Wqq#!",
      },
      {
        name: "third name",
        email: "a3@d.v",
        password: "123Wqq#!",
      },
    ]);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should delete the user with given id", async () => {
    const deletedUser = await usersDb.deleteUser([users[1]._id]);
    expect(deletedUser).toHaveProperty("name", "second name");
    const remaining = await User.find();
    expect(remaining.length).toBe(2);
  });

  it("should return null if given id match no user", async () => {
    const id = new mongoose.Types.ObjectId();
    const deletedUser = await usersDb.deleteUser(id);
    expect(deletedUser).toBeNull();
    const remaining = await User.find();
    expect(remaining.length).toBe(3);
  });
});

describe("updateUsers", () => {
  let users;

  beforeEach(async () => {
    users = await User.insertMany([
      {
        name: "first name",
        email: "a1@d.v",
        password: "123Wqq#!",
      },
      {
        name: "second name",
        email: "a2@d.v",
        password: "123Wqq#!",
      },
      {
        name: "third name",
        email: "a3@d.v",
        password: "123Wqq#!",
      },
    ]);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should change isActive and isConfirmed for users with given ids", async () => {
    const ids = [users[0]._id, users[2]._id];
    const updatedCount = await usersDb.updateUsers(ids, {
      isActive: true,
      isConfirmed: true,
    });
    expect(updatedCount).toBe(2);

    const updatedUsers = await User.find({ isActive: true, isConfirmed: true });
    expect(updatedUsers.length).toBe(2);
  });
});

describe("getUsers", () => {
  const firstCreatedAtDate = new Date("04/01/2023");
  const secondCreatedAtDate = new Date("04/03/2023");
  const thirdCreatedAtDate = new Date("04/05/2023");

  beforeAll(async () => {
    await User.insertMany([
      {
        name: "mohsen",
        email: "t1@w.c",
        password: "c1@W1234",
        role: "user",
        createdAt: firstCreatedAtDate,
      },
      {
        name: "mohsen d",
        email: "t2@w.c",
        password: "c1@W1234",
        role: "user",
        createdAt: secondCreatedAtDate,
      },
      {
        name: "mohsen dor",
        email: "t31@w.c",
        password: "c1@W1234",
        role: "admin",
        createdAt: thirdCreatedAtDate,
      },
    ]);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return all users if no filter or option is sent", async () => {
    const users = await usersDb.getUsers();
    expect(users.length).toBe(3);
  });

  describe("options", () => {
    it("should sort users by given field in given order", async () => {
      const options = { sort: { by: "email", order: -1 } };

      const users = await usersDb.getUsers(options);
      expect(users.length).toBe(3);
      expect(users[0].email).toBe("t31@w.c");
    });

    it("should limit users according to the pageSize", async () => {
      const options = { pageSize: 2 };

      const users = await usersDb.getUsers(options);
      expect(users.length).toBe(2);
    });

    it("should return users according to the pageSize and page", async () => {
      const options = { pageSize: 2, page: 2 };

      const users = await usersDb.getUsers(options);
      expect(users.length).toBe(1);
    });

    it("should return sorted users according to the pageSize and page", async () => {
      const options = {
        sort: { by: "email", order: -1 },
        pageSize: 2,
        page: 2,
      };

      const users = await usersDb.getUsers(options);
      expect(users.length).toBe(1);
      expect(users[0].email).toBe("t1@w.c");
    });

    it("should work with numbers sent in strings", async () => {
      const options = {
        sort: { by: "email", order: "-1" },
        pageSize: "2",
        page: "2",
      };

      const users = await usersDb.getUsers(options);
      expect(users.length).toBe(1);
      expect(users[0].email).toBe("t1@w.c");
    });
  });

  describe("filters", () => {
    it("should return empty array if no user matches filters", async () => {
      const filters = { name: "tttt" };
      const users = await usersDb.getUsers(filters);
      expect(users.length).toBe(0);
    });

    it("should return users which contain the keyword in their string fields", async () => {
      const filters = { email: "1" };
      const users = await usersDb.getUsers(filters);
      expect(users.length).toBe(2);
    });

    it("should return users which have the given role", async () => {
      const filters = { role: "admin" };
      const users = await usersDb.getUsers(filters);
      expect(users.length).toBe(1);
    });

    it("should return users which meet all filters", async () => {
      const filters = { role: "user", email: "1" };
      const users = await usersDb.getUsers(filters);
      expect(users.length).toBe(1);
    });

    it("should return users whithin given range of createdAt dates", async () => {
      const filters = { createdAt: { from: "04/01/2023", to: "04/04/2023" } };

      const users = await usersDb.getUsers(filters);
      expect(users.length).toBe(2);
    });
  });
});

describe("getByToken", () => {
  let user = {
    name: "name",
    email: "e@m.i",
    password: "1234@Wer",
    token: new mongoose.Types.ObjectId(),
  };

  beforeAll(async () => {
    await User.insertMany([user]);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return user with given token", async () => {
    const result = await usersDb.getByToken(user.token);

    expect(result).not.toBeUndefined();
    expect(result.name).toBe("name");
  });

  it("should return null if token matches no user", async () => {
    const result = await usersDb.getByToken(new mongoose.Types.ObjectId());

    expect(result).toBeNull();
  });
});
