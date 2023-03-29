const posts = require("../../../controllers/posts.controller");
const postsDb = require("../../../database/posts.db");

describe("newPost", () => {
  const newPost = {
    title: "title",
    content: "content",
  };

  mockInsert = jest.fn();
  mockInsert.mockReturnValue(newPost);
  postsDb.insert = mockInsert;

  let req = {};

  let res = {
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
    req.body = { ...newPost };
  });

  it("should return with error code 400 if new post is invalid", () => {
    req.body.title = undefined;
    const result = posts.newPost(req, res);
    expect(result.status).toBe(400);
    expect(result.body["title"]).not.toBeUndefined;
  });

  it("should pass valid new post to database layer", () => {
    const result = posts.newPost(req, res);
    expect(postsDb.insert).toHaveBeenCalled();
  });

  it("should return the inserted post", () => {
    const result = posts.newPost(req, res);
    expect(result.body).toEqual(newPost);
  });
});

describe("getPosts", () => {
  const post = {
    title: "title",
    content: "content",
  };

  mockFind = jest.fn();
  mockFind.mockReturnValue([post]);
  postsDb.find = mockFind;

  const req = { body: {} };

  const res = {
    send(response) {
      return {
        body: response,
      };
    },
  };

  it("should get posts from database layer", () => {
    posts.getPosts(req, res);
    expect(postsDb.find).toHaveBeenCalled();
  });

  it("should return found posts to client", () => {
    const result = posts.getPosts(req, res);
    expect(result.body).toEqual(expect.arrayContaining([post]));
  });
});
