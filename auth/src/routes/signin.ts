import { Response, Request, Router } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError, Jwt } from "@didastickets/common";

import { User } from "../models/user";
import { Password } from "../services/password";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password").trim().notEmpty().withMessage("password required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(user.password, password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = Jwt.sign({ id: user.id, email: user.email });
    // Store JWT on cookie
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signInRouter };
