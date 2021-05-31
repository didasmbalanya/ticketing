import { NotFoundError } from "@didastickets/common";
import { Request, Response, Router } from "express";
import { baseRoute } from "./";

const router = Router();

router.delete(`${baseRoute}/orderId`, async (req: Request, res: Response) => {

  res.send({});
});

export { router as deleteOrderRouter };
