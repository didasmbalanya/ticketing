import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@didastickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../../models/order";
import { baseRoute } from "./";

const router = Router();

router.delete(
  `/api/orders/:orderId`,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    // publish an event saing order was cancelled

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
