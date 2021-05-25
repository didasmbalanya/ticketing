import { currentUser } from "@didastickets/common";
import { Router } from "express";
import { createTicketRouter } from "./new";

const router = Router();

router.get("/api/tickets", (req, res) => {
  res.send({
    message: "Welcome to the tickets API",
  });
});

// before all other routes
router.use(currentUser);

router.use(createTicketRouter);

export { router as mainRouter };
