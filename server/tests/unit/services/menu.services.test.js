const menuSrv = require("../../../services/menu.services");

describe("buildGetFilter", () => {
  it("should use the sent value for _id, parentId and ancestors", () => {
    const id = new Array(25).join(1);
    const filter = menuSrv.buildGetFilter({
      _id: id,
      parentId: id,
      ancestors: id,
    });

    expect(filter).toHaveProperty("_id", id);
    expect(filter).toHaveProperty("parentId", id);
    expect(filter).toHaveProperty("ancestors", id);
  });

  it("should use regex for string props", () => {
    const filter = menuSrv.buildGetFilter({
      title: "title",
      url: "url",
    });

    expect(filter).toHaveProperty("title", /title/i);
    expect(filter).toHaveProperty("url", /url/i);
  });

  it("should return empty object if an empty object is provided", () => {
    const filter = menuSrv.buildGetFilter({});
    expect(filter).toEqual({});
  });

  it("should return empty object if no parameter is provided", () => {
    const filter = menuSrv.buildGetFilter();
    expect(filter).toEqual({});
  });

  it("should skip parameter if value is undefined or null", () => {
    const filter = menuSrv.buildGetFilter({
      _id: undefined,
      title: null,
      url: "url",
    });

    expect(filter).toHaveProperty("url", /url/i);
    expect(filter).not.toHaveProperty("_id");
    expect(filter).not.toHaveProperty("title");
  });

  it("should skip parameter if value is invalid", () => {
    const filter = menuSrv.buildGetFilter({
      _id: 1,
      title: "",
      url: "url",
    });

    expect(filter).toHaveProperty("url", /url/i);
    expect(filter).not.toHaveProperty("_id");
    expect(filter).not.toHaveProperty("title");
  });

  it("should truncate string parameters longer than 50 characters instead of deleting them", () => {
    const filter = menuSrv.buildGetFilter({
      title: new Array(55).join("a"),
    });

    expect(filter).toHaveProperty(
      "title",
      new RegExp(new Array(51).join("a"), "i")
    );
  });
});

describe("buildGetOptions", () => {
  const options = {
    sort: { title: 1 },
    limit: 10,
    skip: 0,
  };

  it("should return default values if empty object is passed", () => {
    const result = menuSrv.buildGetOptions({});
    expect(result).toEqual(options);
  });

  it("should return default values if no parameter is passed", () => {
    const result = menuSrv.buildGetOptions();
    expect(result).toEqual(options);
  });

  it("should return default values if invalid values are sent", () => {
    const result = menuSrv.buildGetOptions({
      sort: { by: "foo", order: "bar" },
      pageSize: "a",
      page: "a",
    });

    expect(result).toHaveProperty("sort", { title: 1 });
    expect(result).toHaveProperty("limit", 10);
    expect(result).toHaveProperty("skip", 0);
  });

  it("should return default value if out-of-range values are sent", () => {
    const result = menuSrv.buildGetOptions({
      sort: { by: "parentId", order: 2 },
      pageSize: 1000,
      page: 5000,
    });

    expect(result).toHaveProperty("sort", { title: 1 });
    expect(result).toHaveProperty("limit", 10);
    expect(result).toHaveProperty("skip", 0);
  });

  it("should set options if parameters are valid", () => {
    const result = menuSrv.buildGetOptions({
      pageSize: 25,
      page: 2,
      sort: { by: "title", order: 1 },
    });
    expect(result).toHaveProperty("sort", { title: 1 });
    expect(result).toHaveProperty("limit", 25);
    expect(result).toHaveProperty("skip", 25);
  });

  it("should not reject numeric values sent in string as invalid", () => {
    const result = menuSrv.buildGetOptions({
      pageSize: "15",
      page: "3",
      sort: { by: "title", order: "-1" },
    });
    expect(result).toHaveProperty("sort", { title: -1 });
    expect(result).toHaveProperty("limit", 15);
    expect(result).toHaveProperty("skip", 30);
  });
});
