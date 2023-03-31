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
    const id = new Array(25).join(1);
    const filter = postsSrv.buildGetFilter({ _id: id, display: true });

    expect(filter).toHaveProperty("_id", id);
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

    console.log(filter);

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

  it("should skip parameter if value is invalid", () => {
    const filter = postsSrv.buildGetFilter({
      _id: 1,
      title: "",
      publish: 2,
      display: true,
    });

    expect(filter).toHaveProperty("display", true);
    expect(filter).not.toHaveProperty("_id");
    expect(filter).not.toHaveProperty("title");
    expect(filter).not.toHaveProperty("publish");
  });

  it("should truncate string parameters longer than 50 characters instead of deleting them", () => {
    const filter = postsSrv.buildGetFilter({
      subTitle: new Array(55).join("a"),
    });

    expect(filter).toHaveProperty(
      "subTitle",
      new RegExp(new Array(51).join("a"), "i")
    );
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

  it("should return default values if invalid values are sent", () => {
    const result = postsSrv.buildGetOptions({
      sort: { by: "display", order: true },
      pageSize: "a",
      page: "a",
    });

    expect(result).toHaveProperty("sort", { publish: -1 });
    expect(result).toHaveProperty("limit", 10);
    expect(result).toHaveProperty("skip", 0);
  });

  it("should return default value if out-of-range values are sent", () => {
    const result = postsSrv.buildGetOptions({
      sort: { by: "author", order: 2 },
      pageSize: 1000,
      page: 5000,
    });

    expect(result).toHaveProperty("sort", { publish: -1 });
    expect(result).toHaveProperty("limit", 10);
    expect(result).toHaveProperty("skip", 0);
  });

  it("should set options if parameters are valid", () => {
    const result = postsSrv.buildGetOptions({
      pageSize: 25,
      page: 2,
      sort: { by: "title", order: 1 },
    });
    expect(result).toHaveProperty("sort", { title: 1 });
    expect(result).toHaveProperty("limit", 25);
    expect(result).toHaveProperty("skip", 25);
  });

  it("should not reject numeric values sent in string as invalid", () => {
    const result = postsSrv.buildGetOptions({
      pageSize: "15",
      page: "3",
      sort: { by: "title", order: "-1" },
    });
    expect(result).toHaveProperty("sort", { title: -1 });
    expect(result).toHaveProperty("limit", 15);
    expect(result).toHaveProperty("skip", 30);
  });
});
