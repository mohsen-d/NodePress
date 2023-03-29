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

describe("getPost", () => {
  const post = {
    title: "title",
    content: "content",
  };

  mockFindOne = jest.fn();
  postsDb.findOne = mockFindOne;

  let req = { params: { id: 1 } };

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

  it("should pass id to database layer", () => {
    posts.getPost(req, res);
    expect(postsDb.findOne).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no post", () => {
    const result = posts.getPost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the post if found", () => {
    mockFindOne.mockReturnValue(post);

    const result = posts.getPost(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(post);
  });
});

describe("deletePosts", () => {
  mockDelete = jest.fn();
  postsDb.delete = mockDelete;
  mockDelete.mockReturnValue(3);

  let req = { body: { ids: [1, 2, 3] } };

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

  it("should pass ids to database layer", () => {
    posts.delete(req, res);
    expect(postsDb.delete).toHaveBeenCalledWith(req.body.ids);
  });

  it("should return the number of deleted documents", () => {
    const result = posts.delete(req, res);
    expect(result.body).toBe(3);
  });
});
