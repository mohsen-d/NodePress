const Post = require("../../../models/post.model");

describe("validate", () => {
  let post;
  beforeEach(() => {
    post = new Post({
      author: "author",
      subTitle: "subTitle",
      title: "title",
      content: "content",
      tags: ["tag"],
      publish: Date.now(),
      display: true,
    });
  });

  describe("subTitle", () => {
    it("should consider a subTitle longer than 50 characters as invalid", () => {
      post.subTitle = new Array(52).join("a");
      const result = Post.validate(post);
      expect(result.errors["subTitle"]).toBeDefined();
    });
  });

  describe("title", () => {
    it("should consider a post without title as invalid", () => {
      post.title = undefined;
      const result = Post.validate(post);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider a title longer than 250 characters as invalid", () => {
      post.title = new Array(252).join("a");
      const result = Post.validate(post);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider an empty title as invalid", () => {
      post.title = "";
      const result = Post.validate(post);
      expect(result.errors["title"]).toBeDefined();
    });

    it("should consider spaces-only title as invalid", () => {
      post.title = "   ";
      const result = Post.validate(post);
      expect(result.errors["title"]).toBeDefined();
    });
  });

  describe("content", () => {
    it("should consider a post without content as invalid", () => {
      post.content = undefined;
      const result = Post.validate(post);
      expect(result.errors["content"]).toBeDefined();
    });

    it("should consider an empty content as invalid", () => {
      post.content = "";
      const result = Post.validate(post);
      expect(result.errors["content"]).toBeDefined();
    });

    it("should consider spaces-only content as invalid", () => {
      post.content = "   ";
      const result = Post.validate(post);
      expect(result.errors["content"]).toBeDefined();
    });
  });

  describe("urlTitle", () => {
    it("should consider a urlTitle longer than 50 characters as invalid", () => {
      post.urlTitle = new Array(52).join("a");
      const result = Post.validate(post);
      expect(result.errors["urlTitle"]).toBeDefined();
    });
  });

  describe("tags", () => {
    it("should consider a tag longer than 50 characters as invalid", () => {
      const tag = new Array(52).join("a");
      post.tags = [tag];
      const result = Post.validate(post);
      expect(result.errors["tags"]).toBeDefined();
    });

    it("should consider an empty tag as invalid", () => {
      post.tags = [""];
      const result = Post.validate(post);
      expect(result.errors["tags"]).toBeDefined();
    });

    it("should consider an only-spaces tag as invalid", () => {
      post.tags = ["    "];
      const result = Post.validate(post);
      expect(result.errors["tags"]).toBeDefined();
    });
  });
});

describe("default values", () => {
  it("should set current Date/Time as default value for publish", () => {
    const before = Date.now();
    const post = new Post();
    const after = Date.now();

    expect(+post.publish).toBeGreaterThanOrEqual(+before);
    expect(+post.publish).toBeLessThanOrEqual(+after);
  });

  it("should set true as default value for display", () => {
    const post = new Post();

    expect(post.display).toBe(true);
  });
});
