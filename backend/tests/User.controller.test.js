const supertest = require("supertest");
const app = require("../src/app.js");
const { MONGODB_URI_DEV } = require("../src/config.js");
const mongoose = require("mongoose");
const { server } = require("../src/index.js");
const api = supertest(app);

beforeAll(async () => {
  await mongoose.connection.close();
  await mongoose.connect(MONGODB_URI_DEV);
});

test("GET /api/profile", async () => {
  await api
    .get("/api/profile")
    .expect(401)
    .expect("Content-Type", /application\/json/);
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
