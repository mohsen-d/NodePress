const request = require("supertest");

let server;
beforeEach(() => {
  server = require("../index");
});
afterEach(() => {
  server.close();
});

it("should redirect to setup route if website is not configured yet", async () => {
  const res = await request(server).get("/");
  expect(res.statusCode).toBe(302);
});
