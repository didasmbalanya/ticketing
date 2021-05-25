import mongoose from "mongoose";
import { app } from "./app";

const PORT = 3000;
const { JWT_KEY, MONGO_URI } = process.env;

const start = async () => {
  if (!JWT_KEY || !MONGO_URI) {
    throw new Error("JWT_KEY && MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB CONNECTION success >>>>>>>>>>>>>>>");
  } catch (error) {
    console.log("\n\n>>>>>>>>>>>>>>> DB connect error <<<<<<<<<<<<<<<<<<\n\n");
    console.log(error);
    console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<\n\n");
  }

  app.listen(PORT, () => {
    console.log(`Auth service running on port: ${PORT}`);
  });
};

start();
