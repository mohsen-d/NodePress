const middleware = require("../../../middlewares/validateIds.middleware");
const mongoose = require("mongoose");

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
  req = { method: "get", params: {}, body: {} };
});

it("should ignore post routes", () => {
  req.method = "post";
  middleware(req, res, next);
  expect(status).toBe(200);
});

it("should ignore get() routes without req.params.id", () => {
  middleware(req, res, next);
  expect(status).toBe(200);
});

it("should ignore delete() routes without req.params.id and req.body.ids", () => {
  req.method = "delete";
  middleware(req, res, next);
  expect(status).toBe(200);
});

it("should ignore put() routes without req.params.id, req.body.ids and req.body.parentId", () => {
  req.method = "put";
  middleware(req, res, next);
  expect(status).toBe(200);
});

it("should return with 400 error if req.params.id is invalid", () => {
  req.params.id = "1";
  const result = middleware(req, res, next);
  expect(result.status).toBe(400);
});

it("should return with 400 error if req.body.ids are invalid", () => {
  req.body.ids = ["1", "2"];
  const result = middleware(req, res, next);
  expect(result.status).toBe(400);
});

it("should return with 400 error if req.body.parentId is invalid", () => {
  req.body.parentId = "1";
  const result = middleware(req, res, next);
  expect(result.status).toBe(400);
});

it("should pass with a valid req.params.id", () => {
  req.params.id = new mongoose.Types.ObjectId().toHexString();
  middleware(req, res, next);
  expect(status).toBe(200);
});

it("should pass with a valid req.body.ids", () => {
  req.body.ids = [
    new mongoose.Types.ObjectId().toHexString(),
    new mongoose.Types.ObjectId().toHexString(),
  ];

  middleware(req, res, next);
  expect(status).toBe(200);
});

it("should pass with a valid req.body.parentId", () => {
  req.body.parentId = new mongoose.Types.ObjectId().toHexString();

  middleware(req, res, next);
  expect(status).toBe(200);
});
