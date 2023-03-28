const request = require("supertest");
const mongoose = require("mongoose");

let server;
beforeEach(() => {
  server = require("../../index");
});
afterEach(() => {
  server.close();
  mongoose.disconnect();
});

it("should redirect to setup route if website is not configured yet", async () => {
  const res = await request(server).get("/");
  expect(res.statusCode).toBe(302);
});
