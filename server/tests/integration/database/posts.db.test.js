const postsDb = require("../../../database/posts.db");
const Post = require("../../../models/post.model");
const mongoose = require("mongoose");
require("../../../startup/db")();

afterAll(() => {
  mongoose.disconnect();
});

describe("addPost", () => {
  afterEach(async () => {
    await Post.deleteMany({});
  });

  async function exec() {
    return await postsDb.addPost(
      new Post({
        title: "title",
        content: "content",
      })
    );
  }

  it("should save post to the database", async () => {
    await exec();

    const post = await Post.find({ title: "title" });

    expect(post).not.toBeNull();
  });

  it("should return saved post", async () => {
    const post = await exec();

    expect(post).toHaveProperty("_id");
    expect(post).toHaveProperty("title", "title");
  });
});

describe("getPosts", () => {
  const firstPublishDate = new Date("04/01/2023");
  const secondPublishDate = new Date("04/03/2023");
  const thirdPublishDate = new Date("04/05/2023");

  beforeAll(async () => {
    await Post.insertMany([
      {
        author: "mohsen",
        title: "t1",
        content: "c1",
        tags: ["tag1"],
        publish: firstPublishDate,
      },
      {
        author: "mohsen",
        title: "t2",
        content: "c2",
        tags: ["tag2"],
        publish: secondPublishDate,
      },
      {
        author: "reza",
        title: "t3",
        content: "c3",
        tags: ["tag1", "tag3"],
        publish: thirdPublishDate,
      },
    ]);
  });

  afterAll(async () => {
    await Post.deleteMany({});
  });

  it("should return all posts if no filter or option is sent", async () => {
    const posts = await postsDb.getPosts();
    expect(posts.length).toBe(3);
  });

  describe("options", () => {
    it("should sort posts by given field in given order", async () => {
      const options = { sort: { by: "title", order: -1 } };

      const posts = await postsDb.getPosts(options);
      expect(posts.length).toBe(3);
      expect(posts[0].title).toBe("t3");
    });

    it("should limit posts according to the pageSize", async () => {
      const options = { pageSize: 2 };

      const posts = await postsDb.getPosts(options);
      expect(posts.length).toBe(2);
    });

    it("should return posts according to the pageSize and page", async () => {
      const options = { pageSize: 2, page: 2 };

      const posts = await postsDb.getPosts(options);
      expect(posts.length).toBe(1);
    });

    it("should return sorted posts according to the pageSize and page", async () => {
      const options = {
        sort: { by: "title", order: -1 },
        pageSize: 2,
        page: 2,
      };

      const posts = await postsDb.getPosts(options);
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe("t1");
    });

    it("should work with numbers sent in strings", async () => {
      const options = {
        sort: { by: "title", order: "-1" },
        pageSize: "2",
        page: "2",
      };

      const posts = await postsDb.getPosts(options);
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe("t1");
    });
  });

  describe("filters", () => {
    it("should return empty array if no post matches filters", async () => {
      const filters = { title: "tttt" };
      const posts = await postsDb.getPosts(filters);
      expect(posts.length).toBe(0);
    });

    it("should return posts which contain the keyword in their string fields", async () => {
      const filters = { title: "1" };
      const posts = await postsDb.getPosts(filters);
      expect(posts.length).toBe(1);
    });

    it("should return posts which have the given tag", async () => {
      const filters = { tags: "tag1" };
      const posts = await postsDb.getPosts(filters);
      expect(posts.length).toBe(2);
    });

    it("should return posts which meet all filters", async () => {
      const filters = { tags: "tag1", title: "1" };
      const posts = await postsDb.getPosts(filters);
      expect(posts.length).toBe(1);
    });

    it("should return posts whithin given range of publish dates", async () => {
      const filters = { publish: { from: "04/01/2023", to: "04/04/2023" } };

      const posts = await postsDb.getPosts(filters);
      expect(posts.length).toBe(2);
    });
  });
});
