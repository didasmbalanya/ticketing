import { requireAuth, validateRequest } from "@didastickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/ticket";

const router = express.Router();

export const baseRoute = "/api/tickets";
router.post(
  baseRoute,
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

    const ticket = Ticket.build({ price, title, userId: id });
    await ticket.save();

    const client = natsWrapper.client;

    const publisher = new TicketCreatedPublisher(client);
    publisher.publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
