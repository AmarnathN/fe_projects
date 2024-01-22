import { Router } from "express";
import { signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.put("/signup", signUp);

export default authRouter;
