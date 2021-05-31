import { NotFoundError } from "@didastickets/common";
import { Request, Response, Router } from "express";
import { baseRoute } from "./";

const router = Router();

router.get(`${baseRoute}/:orderId`, async (req: Request, res: Response) => {
  res.send({});
});

export { router as showOrderRouter };
