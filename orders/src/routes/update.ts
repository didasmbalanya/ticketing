import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@didastickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

import { baseRoute } from "./";

const router = express.Router();

router.put(
  `${baseRoute}/:orderId`,
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.currentUser!;

    res.send({});
  }
);

export { router as updateOrderRoute };
