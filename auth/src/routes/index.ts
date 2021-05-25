import { Router } from "express";
import { currentUserRouter } from "./current-user";
import { signInRouter } from "./signin";
import { signOutRouter } from "./signout";
import { signUpRouter } from "./signup";

const router = Router();

router.get("/api/users", (req, res) => {
  res.send({
    message: "Welcome to the auth API",
  });
});

router.use(currentUserRouter);
router.use(signInRouter)
router.use(signOutRouter)
router.use(signUpRouter)

export { router as rootRouter };
