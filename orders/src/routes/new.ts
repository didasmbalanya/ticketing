import { requireAuth, validateRequest } from "@didastickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

import { baseRoute } from ".";

const router = express.Router();

router.post(
  baseRoute,
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.currentUser!;

    res.status(201).send({});
  }
);

export { router as createOrderRouter };
