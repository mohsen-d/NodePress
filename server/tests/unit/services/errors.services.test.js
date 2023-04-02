const errors = require("../../../services/errors.services");
const config = require("config");

it("should return the msg corresponding to the error code", () => {
  const msg = errors._404("post");
  const expected = config.get("errors.404").replace("$var", "post");
  expect(msg).toBe(expected);
});

it("should use default value if msgVariable is not provided", () => {
  const msg = errors._400();
  const expected = config.get("errors.400").replace("$var", "data");
  expect(msg).toBe(expected);
});
