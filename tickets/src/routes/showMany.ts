import { NotFoundError } from "@didastickets/common";
import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";
import { baseRoute } from "./new";

const router = Router();

router.get(`${baseRoute}`, async (req: Request, res: Response) => {
  const tickets = await Ticket.find();

  if (!tickets) {
    throw new NotFoundError();
  }

  res.send(tickets);
});

export { router as showTicketsRouter };
