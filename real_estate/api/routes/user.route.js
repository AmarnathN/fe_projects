import { Router } from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.utils.js";

const userRouter = Router();

userRouter.put("/update/:id", verifyToken, updateUser);

export default userRouter;