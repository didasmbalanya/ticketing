import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import 'jestß'

import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "adadasd";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app).post("/api/users/signup").send({
    email,
    password,
  });

  const cookie = response.get("Set-Cookie");

  return cookie;
};
