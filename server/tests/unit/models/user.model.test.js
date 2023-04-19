const User = require("../../../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("validate", () => {
  let user;
  beforeEach(() => {
    user = new User({
      name: "firstName lastName",
      email: "foo@bar.com",
      password: "123456@Aa",
      role: "user",
      isActive: true,
      isConfirmed: true,
      source: "local",
    });
  });

  describe("valid user", () => {
    it("should pass a valid user", () => {
      const result = User.validate(user);
      expect(result.isValid).toBe(true);
    });
  });

  describe("name", () => {
    it("should consider a name longer than 50 characters as invalid", () => {
      user.name = new Array(52).join("a");
      const result = User.validate(user);
      expect(result.isValid).toBe(false);
      expect(result.errors["name"]).toBeDefined();
    });

    it("should consider a name containing characters other than [a-z\\s\\-\\'] as invalid", () => {
      user.name = "name123";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["name"]).toBeDefined();
    });

    it("should consider a user without name as invalid", () => {
      user.name = undefined;
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["name"]).toBeDefined();
    });

    it("should consider an empty string as name as invalid", () => {
      user.name = "";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["name"]).toBeDefined();
    });

    it("should consider spaces-only string as name as invalid", () => {
      user.name = "    ";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["name"]).toBeDefined();
    });

    it("should lowercase the given name", () => {
      user.name = "FirstName";
      expect(user.name).toBe("firstname");
    });

    it("should trim the given name", () => {
      user.name = "    name   ";
      expect(user.name).toBe("name");
    });
  });

  describe("email", () => {
    it("should consider an email longer than 50 characters as invalid", () => {
      user.email = new Array(50).join("a") + "@domain.com";
      const result = User.validate(user);
      expect(result.isValid).toBe(false);
      expect(result.errors["email"]).toBeDefined();
    });

    it("should not accept an invalid email address", () => {
      user.email = "foo@";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["email"]).toBeDefined();
    });

    it("should consider a user without email as invalid", () => {
      user.email = undefined;
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["email"]).toBeDefined();
    });

    it("should consider an empty string as email as invalid", () => {
      user.email = "";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["email"]).toBeDefined();
    });

    it("should consider spaces-only string as email as invalid", () => {
      user.email = "    ";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["email"]).toBeDefined();
    });

    it("should lowercase the given email", () => {
      user.email = "Foo@Bar.Me";
      expect(user.email).toBe("foo@bar.me");
    });

    it("should trim the given email", () => {
      user.email = "    foo@bar.com   ";
      expect(user.email).toBe("foo@bar.com");
    });
  });

  describe("password", () => {
    it("should consider a user without password as invalid", () => {
      user.password = undefined;
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should consider an empty string as password as invalid", () => {
      user.password = "";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should consider spaces-only string as password as invalid", () => {
      user.password = "    ";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should contain at least a capital letter", () => {
      user.password = "123456@a";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should contain at least a number", () => {
      user.password = "Aaaaaaa@";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should contain at least a special character", () => {
      user.password = "Aa123456";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should be at least 8 characters long", () => {
      user.password = "A#12345";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should be at most 16 characters long", () => {
      user.password = "A#12345678910111213";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["password"]).toBeDefined();
    });

    it("should trim the given password", () => {
      user.password = "    password   ";
      expect(user.password).toBe("password");
    });
  });

  describe("role", () => {
    it("should consider a user undefined role as invalid", () => {
      user.role = undefined;
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["role"]).toBeDefined();
    });

    it("should consider an empty string as role as invalid", () => {
      user.role = "";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["role"]).toBeDefined();
    });

    it("should consider spaces-only string as role as invalid", () => {
      user.role = "    ";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["role"]).toBeDefined();
    });

    it("should only accept 'admin' or 'user' as valid values", () => {
      user.role = "moderator";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["role"]).toBeDefined();
    });

    it("should lowercase the given role", () => {
      user.role = "ADMIN";
      expect(user.role).toBe("admin");
    });

    it("should trim the given role", () => {
      user.role = "    admin   ";
      expect(user.role).toBe("admin");
    });
  });

  describe("source", () => {
    it("should consider a user undefined source as invalid", () => {
      user.source = undefined;
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["source"]).toBeDefined();
    });

    it("should consider an empty string as source as invalid", () => {
      user.source = "";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["source"]).toBeDefined();
    });

    it("should consider spaces-only string as source as invalid", () => {
      user.source = "    ";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["source"]).toBeDefined();
    });

    it("should only accept 'local' or 'google' or 'outlook' as valid values", () => {
      user.source = "facebook";
      const result = User.validate(user);

      expect(result.isValid).toBe(false);
      expect(result.errors["source"]).toBeDefined();
    });

    it("should lowercase the given source", () => {
      user.source = "LOCAL";
      expect(user.source).toBe("local");
    });

    it("should trim the given source", () => {
      user.source = "    google   ";
      expect(user.source).toBe("google");
    });
  });
});

describe("default values", () => {
  it("should set current Date/Time as default value for createdAt", () => {
    const before = Date.now();
    const user = new User();
    const after = Date.now();

    expect(+user.createdAt).toBeGreaterThanOrEqual(+before);
    expect(+user.createdAt).toBeLessThanOrEqual(+after);
  });

  it("should set false as default value for isActive", () => {
    const user = new User();

    expect(user.isActive).toBe(false);
  });

  it("should set false as default value for isConfirmed", () => {
    const user = new User();

    expect(user.isConfirmed).toBe(false);
  });
});

describe("generateAuthToken", () => {
  it("should return a token containing current user's _id and role", () => {
    const user = new User({
      name: "firstName lastName",
      email: "foo@bar.com",
      password: "123",
    });

    const token = user.generateAuthToken();
    const decodedToken = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decodedToken).toHaveProperty("_id");
    expect(decodedToken).toHaveProperty("role", "user");
  });
});

describe("setToken", () => {
  it("should set the value for user.token field", () => {
    const user = new User({
      name: "firstName lastName",
      email: "foo@bar.com",
      password: "123",
    });

    expect(user.token).toBeUndefined();
    user.setToken();
    expect(user.token).not.toBeUndefined();
  });
});

describe("removeToken", () => {
  it("should remove the value in user.token field", () => {
    const user = new User({
      name: "firstName lastName",
      email: "foo@bar.com",
      password: "123",
    });

    user.setToken();
    expect(user.token).not.toBeUndefined();
    user.removeToken();
    expect(user.token).toBeUndefined();
  });
});
