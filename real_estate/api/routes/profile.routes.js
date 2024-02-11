import { Router } from "express";
import { createProfile } from "../controllers/profile.controller.js";
import { verifyToken } from "../utils/verifyUser.utils.js";

const profileRouter = Router();

profileRouter.post("/create", verifyToken , createProfile);

export default profileRouter;