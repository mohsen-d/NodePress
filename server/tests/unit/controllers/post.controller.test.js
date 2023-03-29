const posts = require("../../../controllers/posts.controller");
const postsDb = require("../../../database/posts.db");

const req = {};

const res = {
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

const post = {
  title: "title",
  content: "content",
};

function mockDbMethod(method) {
  postsDb[method] = jest.fn();
}

describe("addPost", () => {
  mockDbMethod("addPost");

  beforeEach(() => {
    req.body = { ...post };
  });

  it("should return with error code 400 if new post is invalid", () => {
    req.body.title = undefined;
    const result = posts.addPost(req, res);
    expect(result.status).toBe(400);
    expect(result.body["title"]).not.toBeUndefined;
  });

  it("should pass valid new post to database layer", () => {
    const result = posts.addPost(req, res);
    expect(postsDb.addPost).toHaveBeenCalled();
  });

  it("should return the inserted post", () => {
    postsDb.addPost.mockReturnValue(post);
    const result = posts.addPost(req, res);
    expect(result.body).toEqual(post);
  });
});

describe("getPosts", () => {
  mockDbMethod("getPosts");

  it("should get posts from database layer", () => {
    posts.getPosts(req, res);
    expect(postsDb.getPosts).toHaveBeenCalled();
  });

  it("should return found posts to client", () => {
    postsDb.getPosts.mockReturnValue([post]);
    const result = posts.getPosts(req, res);
    expect(result.body).toEqual(expect.arrayContaining([post]));
  });
});

describe("getPost", () => {
  mockDbMethod("getPost");

  req.params = { id: 1 };

  it("should pass id to database layer", () => {
    posts.getPost(req, res);
    expect(postsDb.getPost).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no post", () => {
    const result = posts.getPost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the post if found", () => {
    postsDb.getPost.mockReturnValue(post);

    const result = posts.getPost(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(post);
  });
});

describe("deletePost", () => {
  mockDbMethod("deletePost");

  req.params = { id: 1 };

  it("should pass id to database layer", () => {
    posts.deletePost(req, res);
    expect(postsDb.deletePost).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no post", () => {
    const result = posts.deletePost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the deleted post", () => {
    postsDb.deletePost.mockReturnValue(post);

    const result = posts.deletePost(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(post);
  });
});

describe("deletePosts", () => {
  mockDbMethod("deletePosts");

  req.body = { ids: [1, 2, 3] };

  it("should pass ids to database layer", () => {
    posts.deletePosts(req, res);
    expect(postsDb.deletePosts).toHaveBeenCalledWith(req.body.ids);
  });

  it("should return the number of deleted documents", () => {
    postsDb.deletePosts.mockReturnValue(3);
    const result = posts.deletePosts(req, res);
    expect(result.body).toBe(3);
  });
});

describe("updatePost", () => {
  mockDbMethod("updatePost");

  beforeEach(() => {
    req.params = { id: 1 };
    req.body = { ...post };
  });

  it("should return 400 error if data is invalid", () => {
    req.body.title = undefined;
    const result = posts.updatePost(req, res);
    expect(result.status).toBe(400);
  });

  it("should pass valid post to database layer to be updated", () => {
    const result = posts.updatePost(req, res);
    expect(postsDb.updatePost).toHaveBeenCalled();
  });

  it("should return 404 error if post not found", () => {
    postsDb.updatePost.mockReturnValue(undefined);
    const result = posts.updatePost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the updated post", () => {
    postsDb.updatePost.mockReturnValue(post);
    const result = posts.updatePost(req, res);
    expect(result.body).toEqual(post);
  });
});

describe("updatePostsDisplay", () => {
  mockDbMethod("updatePostsDisplay");

  beforeEach(() => {
    req.body = { ids: [1, 2, 3], display: false };
  });

  it("should return with 400 error is display value is invalid", () => {
    req.body.display = 1;
    const result = posts.updatePostsDisplay(req, res);
    expect(result.status).toBe(400);
  });

  it("should pass ids to database layer", () => {
    posts.updatePostsDisplay(req, res);
    expect(postsDb.updatePostsDisplay).toHaveBeenCalledWith(
      req.body.ids,
      req.body.display
    );
  });

  it("should return the number of updated documents", () => {
    postsDb.updatePostsDisplay.mockReturnValue(3);

    const result = posts.updatePostsDisplay(req, res);
    expect(result.body).toBe(3);
  });
});
