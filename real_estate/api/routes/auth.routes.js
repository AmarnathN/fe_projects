import { Router } from "express";
import { signIn, signUp, signInGoogle } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/signin", signIn);

authRouter.post("/signin_google", signInGoogle);

export default authRouter;
