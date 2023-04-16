const jwt = require("jsonwebtoken");
const config = require("config");
const middleware = require("../../../middlewares/auth.middleware");

let status;
let req;

const next = function () {
  status = 200;
};

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

beforeEach(() => {
  status = undefined;
  req = { baseUrl: "/", header: () => {} };
});

describe("public routes", () => {
  it("should ignore and pass", () => {
    req.baseUrl = "/";
    middleware(req, res, next);
    expect(status).toBe(200);
  });
});

describe("admin routes", () => {
  it("should return with 401 error if no token is provided", () => {
    req.baseUrl = "/admin";

    const result = middleware(req, res, next);
    expect(result.status).toBe(401);
  });

  it("should return with 400 error if token is invalid", () => {
    req.baseUrl = "/admin";
    req.header = () => "invalid token";

    const result = middleware(req, res, next);
    expect(result.status).toBe(400);
  });

  it("should return with 403 error if token is valid but role is not admin", () => {
    const token = jwt.sign(
      { role: "user", _id: 1 },
      config.get("jwtPrivateKey")
    );
    req.baseUrl = "/admin";
    req.header = () => token;

    const result = middleware(req, res, next);
    expect(result.status).toBe(403);
  });

  it("should pass if token is valid and role is admin", () => {
    const token = jwt.sign(
      { role: "admin", _id: 1 },
      config.get("jwtPrivateKey")
    );
    req.baseUrl = "/admin";
    req.header = () => token;

    middleware(req, res, next);
    expect(status).toBe(200);
  });

  it("should put decoded data in req.user if token is valid and role is admin", () => {
    const token = jwt.sign(
      { role: "admin", _id: 1 },
      config.get("jwtPrivateKey")
    );
    req.baseUrl = "/admin";
    req.header = () => token;

    middleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.role).toBe("admin");
    expect(req.user._id).toBe(1);
  });
});

describe("user routes", () => {
  it("should return with 401 error if no token is provided", () => {
    req.baseUrl = "/user";

    const result = middleware(req, res, next);
    expect(result.status).toBe(401);
  });

  it("should return with 400 error if token is invalid", () => {
    req.baseUrl = "/user";
    req.header = () => "invalid token";

    const result = middleware(req, res, next);
    expect(result.status).toBe(400);
  });

  it("should pass if token is valid", () => {
    const token = jwt.sign(
      { role: "user", _id: 1 },
      config.get("jwtPrivateKey")
    );
    req.baseUrl = "/user";
    req.header = () => token;

    middleware(req, res, next);
    expect(status).toBe(200);
  });

  it("should put decoded data in req.user if token is valid", () => {
    const token = jwt.sign(
      { role: "user", _id: 1 },
      config.get("jwtPrivateKey")
    );
    req.baseUrl = "/user";
    req.header = () => token;

    middleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.role).toBe("user");
    expect(req.user._id).toBe(1);
  });
});
