const posts = require("../../../controllers/posts.controller");
const postsDb = require("../../../database/posts.db");

describe("addPost", () => {
  const newPost = {
    title: "title",
    content: "content",
  };

  mockAddPost = jest.fn();
  mockAddPost.mockReturnValue(newPost);
  postsDb.addPost = mockAddPost;

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
    const result = posts.addPost(req, res);
    expect(result.status).toBe(400);
    expect(result.body["title"]).not.toBeUndefined;
  });

  it("should pass valid new post to database layer", () => {
    const result = posts.addPost(req, res);
    expect(postsDb.addPost).toHaveBeenCalled();
  });

  it("should return the inserted post", () => {
    const result = posts.addPost(req, res);
    expect(result.body).toEqual(newPost);
  });
});

describe("getPosts", () => {
  const post = {
    title: "title",
    content: "content",
  };

  mockGetPosts = jest.fn();
  mockGetPosts.mockReturnValue([post]);
  postsDb.getPosts = mockGetPosts;

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
    expect(postsDb.getPosts).toHaveBeenCalled();
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

  mockGetPost = jest.fn();
  postsDb.getPost = mockGetPost;

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
    expect(postsDb.getPost).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no post", () => {
    const result = posts.getPost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the post if found", () => {
    mockGetPost.mockReturnValue(post);

    const result = posts.getPost(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(post);
  });
});

describe("deletePost", () => {
  const post = {
    title: "title",
    content: "content",
  };

  mockDeletePost = jest.fn();
  postsDb.deletePost = mockDeletePost;

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
    posts.deletePost(req, res);
    expect(postsDb.deletePost).toHaveBeenCalledWith(req.params.id);
  });

  it("should return 404 error if id matches no post", () => {
    const result = posts.deletePost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the deleted post", () => {
    mockDeletePost.mockReturnValue(post);

    const result = posts.deletePost(req, res);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(post);
  });
});

describe("deletePosts", () => {
  mockDeletePosts = jest.fn();
  postsDb.deletePosts = mockDeletePosts;
  mockDeletePosts.mockReturnValue(3);

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
    posts.deletePosts(req, res);
    expect(postsDb.deletePosts).toHaveBeenCalledWith(req.body.ids);
  });

  it("should return the number of deleted documents", () => {
    const result = posts.deletePosts(req, res);
    expect(result.body).toBe(3);
  });
});

describe("updatePost", () => {
  const post = {
    title: "title",
    content: "content",
  };

  mockUpdatePost = jest.fn();
  postsDb.updatePost = mockUpdatePost;

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
    req = { params: { id: 1 }, body: { ...post } };
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
    mockUpdatePost.mockReturnValue(undefined);
    const result = posts.updatePost(req, res);
    expect(result.status).toBe(404);
  });

  it("should return the updated post", () => {
    mockUpdatePost.mockReturnValue(post);
    const result = posts.updatePost(req, res);
    expect(result.body).toEqual(post);
  });
});

describe("updatePostsDisplay", () => {
  mockUpdateDisplay = jest.fn();
  postsDb.updatePostsDisplay = mockUpdateDisplay;
  mockUpdateDisplay.mockReturnValue(3);

  let req;

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
    req = { body: { ids: [1, 2, 3], display: false } };
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
    const result = posts.updatePostsDisplay(req, res);
    expect(result.body).toBe(3);
  });
});
