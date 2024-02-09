import { Router } from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.utils.js";

const userRouter = Router();

userRouter.put("/update/:id", verifyToken, updateUser);

userRouter.delete("/delete/:id", verifyToken, deleteUser);

export default userRouter;
