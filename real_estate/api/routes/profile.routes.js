import { Router } from "express";
import { createProfile, getProfiles, updateProfile, deleteProfile } from "../controllers/profile.controller.js";
import { verifyToken } from "../utils/verifyUser.utils.js";

const profileRouter = Router();

profileRouter.post("/create", verifyToken , createProfile);

profileRouter.get("/get_profiles", verifyToken, getProfiles)

profileRouter.put("/update/:id", verifyToken, updateProfile);

profileRouter.delete("/delete/:id", verifyToken, deleteProfile);

export default profileRouter;