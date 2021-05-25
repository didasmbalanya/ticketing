import { currentUser } from "@didastickets/common";
import { Router } from "express";
import { createTicketRouter } from "./new";
import { showTicketRouter } from "./show";
import { showTicketsRouter } from "./showMany";

const router = Router();

// before all other routes - decode token and add req.currentUser
router.use(currentUser);

router.use(createTicketRouter);
router.use(showTicketRouter)
router.use(showTicketsRouter)

export { router as mainRouter };
