import { currentUser } from "@didastickets/common";
import { Router } from "express";
import { deleteOrderRouter } from "./delete";
import { createOrderRouter } from "./new";
import { showOrderRouter } from "./show";
import { showOrdersRouter } from "./showMany";
import { updateOrderRoute } from "./update";


const router = Router();

export const baseRoute = "/api/orders";


// before all other routes - decode token and add req.currentUser
router.use(currentUser);

router.use(createOrderRouter);
router.use(showOrderRouter)
router.use(showOrdersRouter)
router.use(updateOrderRoute)
router.use(deleteOrderRouter)

export { router as mainRouter };
