import { NotFoundError, requireAuth } from "@didastickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../../models/order";
import { baseRoute } from "./";

const router = Router();

router.get(`${baseRoute}`, requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

export { router as showOrdersRouter };