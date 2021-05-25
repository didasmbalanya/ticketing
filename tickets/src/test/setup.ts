import { Jwt } from "@didastickets/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";


declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
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

global.signin = () => {
  // build JWT payload { id, email }
  const payload = {
    id: "asdadasdsad",
    email: "test@test.com",
  };

  // create a JWT
  const token = Jwt.sign(payload);

  // build session Object, { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn session in to JSON
  const sessionJSON = JSON.stringify(session);

  // Encode session into base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`express:sess=${base64}`];
};
