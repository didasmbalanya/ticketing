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
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";
import { baseRoute } from "./new";

const router = express.Router();

router.put(
  `${baseRoute}/:id`,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.currentUser!;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ id: req.params.id, title, price });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      title: ticket.title,
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRoute };
