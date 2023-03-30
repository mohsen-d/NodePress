const postsSrv = require("../../../services/posts.services");

describe("buildGetParameters", () => {
  const req = { user: { isAuthenticated: true } };
  const params = { id: 1 };
  it("should return params untouched if user is authenticated", () => {
    const result = postsSrv.buildGetParameters(req, params);
    expect(result).not.toHaveProperty("display");
  });

  it("should add display:true to params if user is not authenticated", () => {
    req.user.isAuthenticated = false;
    const result = postsSrv.buildGetParameters(req, params);
    console.log(params, result);
    expect(result).toHaveProperty("display");
  });
});
