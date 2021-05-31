import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const PORT = 3000;
const { JWT_KEY, MONGO_URI, NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL } =
  process.env;

const start = async () => {
  if (!JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB CONNECTION success >>>>>>>>>>>>>>>");

    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.log("\n\n>>>>> DB/NATS connect error <<<<<<<<<<<\n\n");
    console.log(error);
    console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<\n\n");
  }

  app.listen(PORT, () => {
    console.log(`Auth service running on port: ${PORT}`);
  });
};

start();
