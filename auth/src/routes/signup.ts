import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError, Jwt } from "@didastickets/common";
import { User } from "../models/user";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("email in use");
    }

    const user = User.build({ email, password });
    await user.save();
    // generate JWT
    const userJwt = Jwt.sign({ id: user.id, email: user.email });
    // Store JWT on cookie
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
