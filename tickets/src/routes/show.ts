import { NotFoundError } from "@didastickets/common";
import { Request, Response, Router } from "express";
import { query } from "express-validator";
import { Ticket } from "../models/ticket";
import { baseRoute } from "./new";

const router = Router();

router.get(`${baseRoute}/:id`, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  res.send(ticket);
});

export { router as showTicketRouter };
