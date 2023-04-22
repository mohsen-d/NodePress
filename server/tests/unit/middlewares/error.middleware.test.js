const middleware = require("../../../middlewares/error.middleware");
const winston = require("winston");

let status;
let req = {};

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

winston.error = jest.fn();

it("should call winston to save a log", () => {
  const error = new Error("error");
  middleware(error, req, res, next);
  expect(winston.error).toHaveBeenCalled();
});

it("should return a 500 error", () => {
  const error = new Error("error");
  const result = middleware(error, req, res, next);
  expect(result.status).toBe(500);
});
