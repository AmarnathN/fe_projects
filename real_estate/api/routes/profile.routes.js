import { Router } from "express";
import { createProfile } from "../controllers/profile.controller.js";

const profileRouter = Router();

profileRouter.post("/create", createProfile);

export default profileRouter;