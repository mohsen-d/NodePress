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
    expect(result).toHaveProperty("display");
  });
});

describe("buildGetFilter", () => {
  it("should use the sent value for _id and display", () => {
    const filter = postsSrv.buildGetFilter({ _id: 1, display: true });
    expect(filter).toHaveProperty("_id", 1);
    expect(filter).toHaveProperty("display", true);
  });

  it("should use regex for string props", () => {
    const filter = postsSrv.buildGetFilter({
      author: "author",
      subTitle: "subTitle",
      title: "title",
      content: "content",
      urlTitle: "urlTitle",
      tags: "tags",
    });

    expect(filter).toHaveProperty("author", /author/i);
    expect(filter).toHaveProperty("subTitle", /subTitle/i);
    expect(filter).toHaveProperty("title", /title/i);
    expect(filter).toHaveProperty("content", /content/i);
    expect(filter).toHaveProperty("urlTitle", /urlTitle/i);
    expect(filter).toHaveProperty("tags", /tags/i);
  });

  it("should use $gte and $lte for publish", () => {
    const filter = postsSrv.buildGetFilter({
      publish: { from: "12/12/2022", to: "12/12/2022" },
    });
    expect(filter).toHaveProperty("publish", {
      $gte: "12/12/2022",
      $lte: "12/12/2022",
    });
  });

  it("should return empty object if an empty object is provided", () => {
    const filter = postsSrv.buildGetFilter({});
    expect(filter).toEqual({});
  });

  it("should return empty object if no parameter is provided", () => {
    const filter = postsSrv.buildGetFilter();
    expect(filter).toEqual({});
  });

  it("should skip parameter if value is undefined or null", () => {
    const filter = postsSrv.buildGetFilter({
      _id: undefined,
      title: null,
      display: true,
    });

    expect(filter).toHaveProperty("display", true);
    expect(filter).not.toHaveProperty("_id");
    expect(filter).not.toHaveProperty("title");
  });
});

describe("buildGetOptions", () => {
  const options = {
    sort: { publish: -1 },
    limit: 10,
    skip: 0,
  };

  it("should return default values if empty object is passed", () => {
    const result = postsSrv.buildGetOptions({});
    expect(result).toEqual(options);
  });

  it("should return default values if no parameter is passed", () => {
    const result = postsSrv.buildGetOptions();
    expect(result).toEqual(options);
  });

  it("should set options if parameters are valid", () => {
    const result = postsSrv.buildGetOptions({
      pageSize: 25,
      page: 2,
      sort: { title: 1 },
    });
    expect(result).toHaveProperty("sort", { title: 1 });
    expect(result).toHaveProperty("limit", 25);
    expect(result).toHaveProperty("skip", 25);
  });
});
