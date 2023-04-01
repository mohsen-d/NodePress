const jwt = require("jsonwebtoken");
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
  req = { route: { path: "/" }, header: () => {} };
});

describe("public routes", () => {
  it("should ignore and pass", () => {
    req.route.path = "/posts";
    middleware(req, res, next);
    expect(status).toBe(200);
  });
});

describe("admin routes", () => {
  it("should return with 401 error if no token is provided", () => {
    req.route.path = "/admin/posts";

    const result = middleware(req, res, next);
    expect(result.status).toBe(401);
  });

  it("should return with 400 error if token is invalid", () => {
    req.route.path = "/admin/posts";
    req.header = () => "invalid token";

    const result = middleware(req, res, next);
    expect(result.status).toBe(400);
  });

  it("should pass if token is valid", () => {
    const token = jwt.sign({ username: "mohsen", _id: 1 }, "jwtPrivateKey");
    req.route.path = "/admin/posts";
    req.header = () => token;

    middleware(req, res, next);
    expect(status).toBe(200);
  });

  it("should put decoded data in req.user if token is valid", () => {
    const token = jwt.sign({ username: "mohsen", _id: 1 }, "jwtPrivateKey");
    req.route.path = "/admin/posts";
    req.header = () => token;

    middleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.username).toBe("mohsen");
    expect(req.user._id).toBe(1);
  });
});
