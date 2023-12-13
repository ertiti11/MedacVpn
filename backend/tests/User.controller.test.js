const supertest = require("supertest");
const app = require("../src/app.js");
const { MONGODB_URI_DEV } = require("../src/config.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { server } = require("../src/index.js");
const api = supertest(app);

beforeAll(async () => {
  await mongoose.connection.close();
  await mongoose.connect(MONGODB_URI_DEV);
  await mongoose.connection.dropDatabase();
});





test("register user", async () => {
  const passwordHash = await bcrypt.hash("test123", 10);

  const newUser = {
    username: "testt",
    email: "testt@gmail.com",
    password: passwordHash,
  };
  await api
    .post("/api/register")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);
});

test("repeated register user", async () => {
  const passwordHash = await bcrypt.hash("test123", 10);

  const newUser = {
    username: "test",
    email: "test@gmail.com",
    password: passwordHash,
  };

  await api
    .post("/api/register")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  const res = await api.post("/api/register").send(newUser);

  expect(res.body.message).toBe("Username or email already exists");
});

test("GET /api/profile without cookie", async () => {
  await api
    .get("/api/profile")
    .expect(401)
    .expect("Content-Type", /application\/json/);
});

test("login user", async () => {
  const user = {
    email: "test@gmail.com",
    password: "test123",
  };
  const res = await api
    .post("/api/login")
    .send(user)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
