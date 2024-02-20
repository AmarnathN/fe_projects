import { Router } from "express";
import { signIn, signUp, signInGoogle, signout, check_token } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.utils.js";

const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/signin", signIn);

authRouter.post("/signin_google", signInGoogle);

authRouter.get("/signout/:id", signout);

authRouter.get("/check_token", verifyToken, check_token);

export default authRouter;
