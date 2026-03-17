import express from "express";
import { onboardUser } from "../controller/userController.js";
import { requireAuth } from '@clerk/express'

const userRoute = express.Router();

// userRoute.get("/:id", requireAuth(), getUser);
userRoute.post("/onboard", requireAuth(), onboardUser);


export default userRoute;
