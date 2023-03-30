const postsDb = require("../../../database/posts.db");
const Post = require("../../../models/post.model");
require("../../../startup/db")();

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
