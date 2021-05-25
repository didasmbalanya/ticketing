import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";

import { errorHandler, NotFoundError } from "@didastickets/common";
import { mainRouter } from "./routes";

const app = express();
const { NODE_ENV } = process.env;

app.set("trust proxy", true);
app.use(cors({ credentials: true }));
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: NODE_ENV !== "test",
  })
);

app.use(mainRouter)


app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
